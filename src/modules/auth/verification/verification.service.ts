import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType, User } from '@prisma/client'
import { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { saveSession } from '@/src/shared/utils/session.util'

// import { MailService } from '../../libs/mail/mail.service'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService
		// private readonly mailService: MailService
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const user = await this.confirmEmailByToken(input.token)

		const metadata = getSessionMetadata(req, userAgent)

		await saveSession(req, user, metadata)

		return user
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY
		)

		// await this.mailService.sendVerificationMail(
		// 	user.email,																	     /** COMMENTED TO AVOID EMAIL VERIFICATION */
		// 	verificationToken.token
		// )

		// await this.confirmEmailByToken(verificationToken.token) /**COMMENTED TO AVOID AUTOMATIC VERIFICATION */
		console.log('Verification token:', verificationToken.token)

		return verificationToken.token
	}

	private async confirmEmailByToken(token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY
			}
		})

		if (!existingToken) {
			throw new NotFoundException('Verification token not found')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired) {
			throw new BadRequestException('Verification token has expired')
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		})

		return user
	}
}
