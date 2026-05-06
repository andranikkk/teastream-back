import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'
import { TelegramService } from '../libs/telegram/telegram.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly storageService: StorageService,
		private readonly telegramService: TelegramService
	) {}

	// @Cron('*/10 * * * * *') // Every 10 secs
	@Cron('0 0 * * *') // Every day at midnight
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
}
