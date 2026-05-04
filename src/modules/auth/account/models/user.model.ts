import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { User } from '@prisma/client'

import { FollowModel } from '@/src/modules/follow/models/follow.model'
import { NotificationSettingsModel } from '@/src/modules/notification/models/notification-settings.model'
import { NotificationModel } from '@/src/modules/notification/models/notification.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'

import { SocialLinkModel } from '../../profile/models/social-link.model'

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => String)
	username: string

	@Field(() => String)
	displayName: string

	@Field(() => String, { nullable: true })
	avatar: string

	@Field(() => String, { nullable: true })
	bio: string

	@Field(() => String, { nullable: true })
	telegramId: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isDeactivated: boolean

	@Field(() => Date, { nullable: true })
	deactivatedAt: Date

	@Field(() => Boolean)
	isTotpEnabled: boolean

	@Field(() => String, { nullable: true })
	totpSecret: string

	@Field(() => [SocialLinkModel])
	socialLinks: SocialLinkModel[]

	@Field(() => [FollowModel])
	following: FollowModel[]

	@Field(() => [FollowModel])
	follower: FollowModel[]

	@Field(() => StreamModel, { nullable: true })
	streams: StreamModel

	@Field(() => [NotificationModel])
	notifications: NotificationModel[]

	@Field(() => NotificationSettingsModel)
	notificationSettings: NotificationSettingsModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
