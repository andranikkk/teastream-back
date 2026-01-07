import {
	BadRequestException,
	ConflictException,
	Injectable
} from '@nestjs/common'
import type { User } from '@prisma/client'
import * as sharp from 'sharp'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../../libs/storage/storage.service'

import { ChangeProfileInfoInput } from './change-profile-info.input'

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

		const fileName = `channels/${user.username}.webp`

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
			return
		}

		await this.storageService.remove(user.avatar)

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
}
