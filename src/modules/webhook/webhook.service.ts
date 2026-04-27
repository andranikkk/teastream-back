import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LivekitService } from '../libs/livekit/livekit.service'

@Injectable()
export class WebhookService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService
	) {}

	public async receiveWebhookLivekit(body: string, authorization: string) {
		// eslint-disable-next-line @typescript-eslint/await-thenable
		const event = await this.livekitService.webhook.receive(
			body,
			authorization,
			true
		)

		if (event.event === 'ingress_started') {
			console.log('Stream started!! ->', event.ingressInfo.url)

			await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo.ingressId
				},
				data: {
					isLive: true
				}
			})
		}

		if (event.event === 'ingress_ended') {
			await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo.ingressId
				},
				data: {
					isLive: false
				}
			})
		}
	}
}
