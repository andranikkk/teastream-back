import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsString,
	IsUUID,
	MinLength,
	Validate
} from 'class-validator'

import { IsPasswordMatchingConstraint } from '@/src/shared/decorators/is-password-matching-constraint.decorator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public newPassword: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordMatchingConstraint)
	public newPasswordRepeat: string

	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	public token: string
}
