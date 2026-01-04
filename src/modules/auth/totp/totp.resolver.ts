import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { EnableTotpInput } from './inputs/enable-totp.input'
import { TotpModel } from './models/totp.model'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	public constructor(private readonly totpService: TotpService) {}

	@AuthDecoration()
	@Query(() => TotpModel, { name: 'generateTotpSecret' })
	public async generate(@Authorized() user: User) {
		return this.totpService.generate(user)
	}

	@AuthDecoration()
	@Mutation(() => Boolean, { name: 'enableTotp' })
	public async enable(
		@Authorized() user: User,
		@Args('data') input: EnableTotpInput
	) {
		return this.totpService.enable(user, input)
	}

	@AuthDecoration()
	@Mutation(() => Boolean, { name: 'disableTotp' })
	public async disable(@Authorized() user: User) {
		return this.totpService.disable(user)
	}
}
