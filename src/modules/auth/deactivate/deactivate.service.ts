import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TokenType, type User } from '@prisma/client'
import { verify } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession } from '@/src/shared/utils/session.util'

import { MailService } from '../../libs/mail/mail.service'
import { TelegramService } from '../../libs/telegram/telegram.service'

import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
		private readonly telegramService: TelegramService
	) {}

	public async deactivate(
		req: Request,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string
	) {
		const { email, password, pin } = input

		if (user.email !== email) {
			throw new BadRequestException('Email does not match')
		}

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) {
			throw new BadRequestException('Invalid password')
		}

		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent)

			return { message: 'Deactivate token sent to email' }
		}

		await this.validateDeactivateToken(req, pin)

		return { user }
	}

	private async validateDeactivateToken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.DEACTIVATE_ACCOUNT }
		})

		if (!existingToken) {
			throw new NotFoundException('Deactivate token not found')
		}

		const hasExpired = existingToken.expiresIn < new Date()
		if (hasExpired) {
			throw new NotFoundException('Deactivate token has expired')
		}

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.DEACTIVATE_ACCOUNT }
		})

		return destroySession(req, this.configService)
	}

	public async sendDeactivateToken(
		req: Request,
		user: User,
		userAgent: string
	) {
		const deactivationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT,
			false
		)

		const metadata = getSessionMetadata(req, userAgent)

		// await this.mailService.sendDeactivateMail(
		// 	user.email,
		// 	deactivationToken.token,                    /** COMMENTED TO AVOID EMAIL VERIFICATION */
		// 	metadata
		// )

		if (
			deactivationToken.user.notificationSettings
				?.telegramNotifications &&
			deactivationToken.user.telegramId
		) {
			await this.telegramService.sendDeactivateToken(
				deactivationToken.user.telegramId,
				deactivationToken.token,
				metadata
			)

			await this.telegramService.sendAccountDeletedMessage(
				deactivationToken.user.telegramId
			)
		}

		return true
	}
}
