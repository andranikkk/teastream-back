import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Prisma, User } from '@prisma/client'
import { AccessToken } from 'livekit-server-sdk'
// import Upload from 'graphql-upload/Upload.mjs'
import sharp from 'sharp'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../libs/storage/storage.service'

import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { FiltersInput } from './inputs/filters.input'
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input'

@Injectable()
export class StreamService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService
	) {}

	public async findAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input

		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined

		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: {
				user: {
					isDeactivated: false
				},
				...whereClause
			},
			include: {
				user: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return streams
	}

	public async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false
				}
			}
		})

		const randomIndex = new Set<number>()

		while (randomIndex.size < 4) {
			const randomIndexValue = Math.floor(Math.random() * total)
			randomIndex.add(randomIndexValue)
		}

		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false
				}
			},
			include: {
				user: true
			},
			take: total,
			skip: 0
		})

		return Array.from(randomIndex).map(index => streams[index])
	}

	public async changeInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				title
			}
		})

		return true
	}

	public async changeThumbnail(user: User, file: any) {
		const stream = await this.findByUserId(user)

		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `streams/${user.username}.webp`

		if (file.fileName && file.fileName.endWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(1920, 1080)
				.webp()
				.toBuffer()

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(1920, 1080)
				.webp()
				.toBuffer()

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		}

		// const fileName = `streams/${user.username}.webp`

		// const isGif = file.mimetype === 'image/gif'

		// const sharpInstance = sharp(file.buffer, {
		// 	animated: isGif
		// }).resize(1920, 1080)

		// const processedBuffer = await sharpInstance.webp().toBuffer()

		// await this.storageService.upload(
		// 	processedBuffer,
		// 	fileName,
		// 	'image/webp'
		// )

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: fileName }
		})

		return true
	}

	public async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user)

		if (!stream.thumbnailUrl) {
			return
		}

		const key = stream.thumbnailUrl.startsWith('/')
			? stream.thumbnailUrl.slice(1)
			: stream.thumbnailUrl

		await this.storageService.remove(key)

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: null }
		})

		return true
	}

	public async generateToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input

		let self: { id: string; username: string }

		const user = await this.prismaService.user.findUnique({
			where: { id: userId }
		})

		if (user) {
			self = { id: user.id, username: user.username }
		} else {
			self = {
				id: userId,
				username: `Guest №${Math.floor(Math.random() * 1000000)}`
			}
		}

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId
			}
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		const isHost = self.id === channel.id

		const token = new AccessToken(
			this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
			this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
			{
				identity: isHost ? `Host-${self.id}` : self.id.toString(),
				name: self.username
			}
		)

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false
			// canPublishData: true //** no need */
		})

		return { token: token.toJwt() }
	}

	private async findByUserId(user: User) {
		const stream = await this.prismaService.stream.findUnique({
			where: {
				userId: user.id
			}
		})

		return stream
	}

	private findBySearchTermFilter(
		searchTerm: string
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					},
					user: {
						username: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
					// category: {
					// 	username: {
					// 		contains: searchTerm,
					// 		mode: 'insensitive'
					// 	}
					// }
				}
			]
		}
	}
}
