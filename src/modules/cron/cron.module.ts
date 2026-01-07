import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { StorageModule } from '../libs/storage/storage.module'

import { CronService } from './cron.service'

@Module({
	imports: [ScheduleModule.forRoot(), StorageModule],
	providers: [CronService]
})
export class CronModule {}
