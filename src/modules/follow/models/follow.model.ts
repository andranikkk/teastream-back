import { Field, ObjectType } from '@nestjs/graphql'
import { Follow } from '@prisma/client'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

@ObjectType()
export class FollowModel implements Follow {
	@Field(() => String)
	public id: string

	@Field(() => UserModel)
	public follower: UserModel

	@Field(() => String)
	public followerId: string

	@Field(() => UserModel)
	public following: UserModel

	@Field(() => String)
	public followingId: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
