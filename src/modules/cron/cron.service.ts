import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	// @Cron('*/10 * * * * *') // Every 10 secs
	@Cron('0 0 * * *') // Every day at midnight
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
		// sevenDaysAgo.setSeconds(sevenDaysAgo.getSeconds() - 5) // FOR TESTING PURPOSES ONLY

		// const deactivatedAccounts = await this.prismaService.user.findMany({
		// 	where: {
		// 		isDeactivated: true,
		// 		deactivatedAt: {
		// 			lte: sevenDaysAgo
		// 		}
		// 	}
		// })
		// for (const user of deactivatedAccounts) { /** COMMENTED TO AVOID EMAIL VERIFICATION */
		// 	await this.mailService.sendAccountDeletionMail(user.email)
		// }

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
