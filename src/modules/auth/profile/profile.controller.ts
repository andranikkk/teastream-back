import {
	Body,
	Controller,
	Delete,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { User } from '@prisma/client'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@AuthDecoration()
	@Post('avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	async changeAvatar(
		@Authorized() user: User,
		@UploadedFile(FileValidationPipe)
		file: Express.Multer.File
	) {
		return this.profileService.changeAvatar(user, file)
	}

	@AuthDecoration()
	@Delete('avatar')
	async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}

	@AuthDecoration()
	@Patch('info')
	async changeInfo(
		@Authorized() user: User,
		@Body() input: ChangeProfileInfoInput
	) {
		return this.profileService.changeInfo(user, input)
	}
}
