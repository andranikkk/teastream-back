import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'
import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly notificationService: NotificationService,
		private readonly storageService: StorageService,
		private readonly telegramService: TelegramService
	) {}

	// @Cron('*/10 * * * * *') // Every 10 secs
	@Cron(CronExpression.EVERY_DAY_AT_1AM) // Every day at 1 AM
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
		sevenDaysAgo.setSeconds(sevenDaysAgo.getSeconds() - 5) // FOR TESTING PURPOSES ONLY

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			},
			include: {
				notificationSettings: true,
				streams: true
			}
		})
		for (const user of deactivatedAccounts) {
			// await this.mailService.sendAccountDeletionMail(user.email) /** COMMENTED TO AVOID EMAIL VERIFICATION */

			if (
				user.notificationSettings.telegramNotifications &&
				user.telegramId
			) {
				await this.telegramService.sendAccountDeletedMessage(
					user.telegramId
				)
			}

			if (user.avatar) {
				await this.storageService.remove(user.avatar)
			}

			if (user.streams.thumbnailUrl) {
				await this.storageService.remove(user.streams.thumbnailUrl)
			}
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}

	@Cron('0 0 */4 * *') // Every 4 days
	// @Cron('*/15 * * * * *') // Every 15 secs
	public async notifyUserEnableTwoFactor() {
		const users = await this.prismaService.user.findMany({
			where: {
				isTotpEnabled: false
			},
			include: {
				notificationSettings: true
			}
		})

		for (const user of users) {
			// await this.mailService.sendEnableTwoFactor(user.email) /** COMMENTED TO AVOID EMAIL VERIFICATION */

			if (user.notificationSettings.siteNotifications) {
				await this.notificationService.createEnableTwoFactor(user.id)
			}

			if (
				user.notificationSettings.telegramNotifications &&
				user.telegramId
			) {
				await this.telegramService.sendEnableTwoFactor(user.telegramId)
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_2AM)
	public async verifyChannels() {
		const users = await this.prismaService.user.findMany({
			include: {
				notificationSettings: true
			}
		})

		for (const user of users) {
			const followersCount = await this.prismaService.follow.count({
				where: {
					followingId: user.id
				}
			})

			if (followersCount > 10 && !user.isVerified) {
				await this.prismaService.user.update({
					where: {
						id: user.id
					},
					data: {
						isVerified: true
					}
				})

				// await this.mailService.sendVerifyChannelMail(user.email) /** COMMENTED TO AVOID EMAIL VERIFICATION */

				if (user.notificationSettings.siteNotifications) {
					await this.notificationService.createVerifyChannel(user.id)
				}

				if (
					user.notificationSettings.telegramNotifications &&
					user.telegramId
				) {
					await this.telegramService.sendVerifyChannel(
						user.telegramId
					)
				}
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_3AM)
	public async deleteOldNotifications() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		await this.prismaService.notification.deleteMany({
			where: {
				createdAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
}
