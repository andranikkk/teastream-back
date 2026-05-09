import { Injectable } from '@nestjs/common'
import type { SponsorshipPlan, User } from '@prisma/client'
import { NotificationType, TokenType } from '@prisma/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'

import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input'

@Injectable()
export class NotificationService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				isRead: false,
				userId: user.id
			}
		})

		return count
	}

	public async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				isRead: false,
				userId: user.id
			},
			data: {
				isRead: true
			}
		})

		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return notifications
	}

	public async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User
	) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>You have a new sponsorship!</b> <p>@${sponsor.displayName} just sponsored you with the plan: ${plan.title} for $${plan.price}!</p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	public async createEnableTwoFactor(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: ` <p>Enable <b className='font-medium'>Two-Factor Authentication</b> in your account settings.</p>`,
				type: NotificationType.ENABLE_TWO_FACTOR,
				userId
			}
		})

		return notification
	}

	public async createVerifyChannel(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: ` <p>Congratulations! Your channel has been successfully verified.</p>`,
				type: NotificationType.VERIFIED_CHANNEL,
				userId
			}
		})

		return notification
	}

	public async changeSettings(
		user: User,
		input: ChangeNotificationSettingsInput
	) {
		const { siteNotifications, telegramNotifications } = input

		const notificationSettings =
			await this.prismaService.notificationSettings.upsert({
				where: {
					userId: user.id
				},
				create: {
					siteNotifications,
					telegramNotifications,
					user: {
						connect: {
							id: user.id
						}
					}
				},
				update: {
					siteNotifications,
					telegramNotifications
				},
				include: {
					user: true
				}
			})

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user.telegramId
		) {
			const telegramAuthToken = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH
			)

			return {
				notificationSettings,
				telegramAuthToken: telegramAuthToken.token
			}
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					telegramId: null
				}
			})

			return { notificationSettings }
		}

		return { notificationSettings }
	}

	public async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>Do not miss the stream!</b> <p>Join <a className='font-semibold' href='/${channel.username}'>${channel.displayName}</a>'s stream now!</p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}

	public async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>You have a new follower!</b> <p><a className='font-semibold' href='/${follower.username}'>${follower.displayName}</a>just followed you!</p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return notification
	}
}
