import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { StorageModule } from '../libs/storage/storage.module'
import { NotificationService } from '../notification/notification.service'

import { CronService } from './cron.service'

@Module({
	imports: [ScheduleModule.forRoot(), StorageModule],
	providers: [CronService, NotificationService]
})
export class CronModule {}
