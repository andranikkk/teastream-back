import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { User } from '@prisma/client'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@AuthDecoration()
	@Post('avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	async changeAvatar(
		@Authorized() user: User,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.profileService.changeAvatar(user, file)
	}

	@AuthDecoration()
	async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}
}
