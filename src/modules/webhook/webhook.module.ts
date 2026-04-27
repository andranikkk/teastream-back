import { type MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'

import { RawBodyMiddleware } from '@/src/shared/middlewares/rawbody.middleware'

import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'

@Module({
	controllers: [WebhookController],
	providers: [WebhookService]
})
export class WebhookModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RawBodyMiddleware)
			.forRoutes({ path: 'webhook/livekit', method: RequestMethod.POST })
	}
}
