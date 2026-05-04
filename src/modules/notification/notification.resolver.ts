import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input'
import { ChangeNotificationSettingsResponse } from './models/notification-settings.model'
import { NotificationModel } from './models/notification.model'
import { NotificationService } from './notification.service'

@Resolver('Notification')
export class NotificationResolver {
	public constructor(
		private readonly notificationService: NotificationService
	) {}

	@AuthDecoration()
	@Query(() => Number, { name: 'unreadNotificationCount' })
	public async unreadCount(@Authorized() user: User) {
		return this.notificationService.findUnreadCount(user)
	}

	@AuthDecoration()
	@Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
	public async notifications(@Authorized() user: User) {
		return this.notificationService.findByUser(user)
	}

	@AuthDecoration()
	@Mutation(() => ChangeNotificationSettingsResponse, {
		name: 'changeNotificationSettings'
	})
	public async changeSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeNotificationSettingsInput
	) {
		return this.notificationService.changeSettings(user, input)
	}
}
