import { ConfigService } from '@nestjs/config'

import type { TelegrafModuleOptions } from './../../../node_modules/nestjs-telegraf/dist/interfaces/telegraf-options.interface.d'

export function getTelegrafConfig(
	configService: ConfigService
): TelegrafModuleOptions {
	return {
		token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
	}
}
