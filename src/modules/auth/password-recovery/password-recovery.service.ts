import {
	BadRequestException,
	Injectable,
	NotAcceptableException,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/client'
import { hash } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { MailService } from '../../libs/mail/mail.service'
import { TelegramService } from '../../libs/telegram/telegram.service'

import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly telegramService: TelegramService
	) {}

	public async resetPassword(
		req: Request,
		input: ResetPasswordInput,
		userAgent: string
	) {
		const { email } = input

		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				notificationSettings: true
			}
		})
		if (!user) {
			throw new NotAcceptableException(
				'If an account with that email exists, a password reset link has been sent.'
			)
		}

		const passwordResetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET
		)

		const metadata = getSessionMetadata(req, userAgent)

		// await this.mailService.sendPasswordResetMail(
		// 	user.email, 																		/** COMMENTED TO AVOID EMAIL VERIFICATION */
		// 	passwordResetToken.token,
		// 	metadata
		// )

		if (
			passwordResetToken.user.notificationSettings
				.telegramNotifications &&
			passwordResetToken.user.telegramId
		) {
			await this.telegramService.sendPasswordResetToken(
				passwordResetToken.user.telegramId,
				passwordResetToken.token,
				metadata
			)
		}

		return true
	}

	public async newPassword(input: NewPasswordInput) {
		const { token, newPassword } = input

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
			}
		})
		if (!existingToken) {
			throw new NotFoundException('Token not exists')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired) {
			throw new BadRequestException('Token has expired')
		}

		await this.prismaService.user.update({
			where: { id: existingToken.userId },
			data: { password: await hash(newPassword) }
		})

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.PASSWORD_RESET }
		})

		return true
	}
}
