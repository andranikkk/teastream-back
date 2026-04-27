import { Module } from '@nestjs/common'

import { StorageModule } from '../libs/storage/storage.module'

import { IngressModule } from './ingress/ingress.module'
import { StreamResolver } from './stream.resolver'
import { StreamService } from './stream.service'

@Module({
	imports: [StorageModule, IngressModule],
	providers: [StreamResolver, StreamService]
})
export class StreamModule {}
