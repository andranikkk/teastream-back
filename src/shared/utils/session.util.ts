import { InternalServerErrorException } from '@nestjs/common'
import type { Request } from 'express'

import type { User } from '@/prisma/generated'

import type { SessionMetadata } from '../types/session-metadata.types'

export function saveSession(
	req: Request,
	user: User,
	metadata: SessionMetadata
) {
	return new Promise((resolve, reject) => {
		req.session.userId = user.id
		req.session.createdAt = new Date().toISOString()
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				return reject(
					new InternalServerErrorException('Failed to save session')
				)
			}
		})
	})
}
