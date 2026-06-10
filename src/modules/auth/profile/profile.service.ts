import {
	BadRequestException,
	ConflictException,
	Injectable
} from '@nestjs/common'
import type { User } from '@prisma/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../../libs/storage/storage.service'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from './inputs/social-link.input'

const sharp = require('sharp')

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	public async changeAvatar(user: User, file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException('File is required')
		}

		if (user.avatar) {
			await this.storageService.remove(user.avatar)
		}

		const fileName = `uploads/${file.originalname}`

		const isGif = file.mimetype === 'image/gif'

		const sharpInstance = sharp(file.buffer, {
			animated: isGif
		}).resize(512, 512)

		const processedBuffer = await sharpInstance.webp().toBuffer()

		await this.storageService.upload(
			processedBuffer,
			fileName,
			'image/webp'
		)

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: fileName }
		})

		return true
	}

	public async removeAvatar(user: User) {
		if (!user.avatar) {
			return true
		}

		const key = user.avatar.startsWith('/')
			? user.avatar.slice(1)
			: user.avatar

		await this.storageService.remove(key)

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: null }
		})

		return true
	}

	public async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, displayName, bio } = input

		const userNameExists = await this.prismaService.user.findUnique({
			where: { username }
		})
		if (userNameExists && username !== user.username) {
			throw new ConflictException('Username already taken')
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				username,
				displayName,
				bio: bio ?? null
			}
		})

		return true
	}

	public async findSocialLinks(user: User) {
		const socialLinks = await this.prismaService.socialLink.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				position: 'asc'
			}
		})

		return socialLinks
	}

	public async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input

		const lastSocialLink = await this.prismaService.socialLink.findFirst({
			where: { userId: user.id },
			orderBy: { position: 'desc' }
		})

		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

		await this.prismaService.socialLink.create({
			data: {
				title,
				url,
				position: newPosition,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return true
	}

	public async reorderSocialLinks(list: SocialLinkOrderInput[]) {
		if (!list.length) {
			return
		}

		const updatePromises = list.map(socialLink => {
			return this.prismaService.socialLink.update({
				where: { id: socialLink.id },
				data: { position: socialLink.position }
			})
		})

		await Promise.all(updatePromises)

		return true
	}

	public async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input

		await this.prismaService.socialLink.update({
			where: { id },
			data: {
				title,
				url
			}
		})

		return true
	}

	public async removeSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: { id }
		})

		return true
	}
}
