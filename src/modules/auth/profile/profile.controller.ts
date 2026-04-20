import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { User } from '@prisma/client'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from './inputs/social-link.input'
import { SocialLinkModel } from './models/social-link.model'
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

	@AuthDecoration()
	@Get('social-link')
	async findSocialLinks(
		@Authorized() user: User
	): Promise<SocialLinkModel[]> {
		return this.profileService.findSocialLinks(user)
	}

	@AuthDecoration()
	@Post('social-link')
	async createSocialLink(
		@Authorized() user: User,
		@Body() input: SocialLinkInput
	) {
		return this.profileService.createSocialLink(user, input)
	}

	@AuthDecoration()
	@Put('social-link/order')
	async reorderSocialLinks(@Body() input: SocialLinkOrderInput[]) {
		return this.profileService.reorderSocialLinks(input)
	}

	@AuthDecoration()
	@Patch('social-link/:id')
	async updateSocialLink(
		@Param('id') id: string,
		@Body() input: SocialLinkInput
	) {
		return this.profileService.updateSocialLink(id, input)
	}

	@AuthDecoration()
	@Delete('social-link/:id')
	async removeSocialLink(@Param('id') id: string) {
		return this.profileService.removeSocialLink(id)
	}
}
