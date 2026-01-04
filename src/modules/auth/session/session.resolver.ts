import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/src/shared/types/gql-context.types'

import { AuthModel } from '../account/models/auth.model'

import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@AuthDecoration()
	@Query(() => [SessionModel], { name: 'findSessionByUser' })
	public async fundByUser(@Context() { req }: GqlContext) {
		return this.sessionService.findByUser(req)
	}

	@AuthDecoration()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	public async findCurrent(@Context() { req }: GqlContext) {
		return this.sessionService.findCurrent(req)
	}

	@Mutation(() => AuthModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, input, userAgent)
	}

	@AuthDecoration()
	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req)
	}

	@Mutation(() => Boolean, { name: 'clearSessionCookie' })
	public async clearSession(@Context() { req }: GqlContext) {
		return this.sessionService.clearSession(req)
	}

	@AuthDecoration()
	@Mutation(() => Boolean, { name: 'removeSession' })
	public async remove(
		@Context() { req }: GqlContext,
		@Args('id') id: string
	) {
		return this.sessionService.remove(req, id)
	}
}
