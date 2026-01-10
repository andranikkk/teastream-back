import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType()
export class SocialLinkInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	public title: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public url: string
}

@InputType()
export class SocialLinkOrderInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	public id: string

	@Field(() => Number)
	@IsNumber()
	@IsNotEmpty()
	public position: number
}
