import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import type { User } from '@prisma/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input'
import { SendMessageInput } from './inputs/send-message.input'

@Injectable()
export class ChatService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findMessagesByStream(streamId: string) {
		const messages = await this.prismaService.chatMessage.findMany({
			where: {
				streamId
			},
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				user: true
			}
		})

		return messages
	}

	public async sendMessage(userId: string, input: SendMessageInput) {
		const { text, streamId } = input

		const stream = await this.prismaService.stream.findUnique({
			where: {
				id: streamId
			}
		})

		if (!stream) {
			throw new NotFoundException('Stream not found')
		}

		if (!stream.isLive) {
			throw new BadRequestException('Stream is not live')
		}

		const message = await this.prismaService.chatMessage.create({
			data: {
				text,
				user: {
					connect: {
						id: userId
					}
				},
				stream: {
					connect: {
						id: streamId
					}
				}
			}
		})

		return message
	}

	public async changeSettings(user: User, input: ChangeChatSettingsInput) {
		const {
			isChatEnabled,
			isChatFollowersOnly,
			isChatPremiumFollowersOnly
		} = input

		const message = await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				isChatEnabled,
				isChatFollowersOnly,
				isChatPremiumFollowersOnly
			}
		})

		return message
	}
}
