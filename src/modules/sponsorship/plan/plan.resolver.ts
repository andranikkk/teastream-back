import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/client'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { CreatePlanInput } from './inputs/create-plan.input'
import { PlanModel } from './models/plan.model'
import { PlanService } from './plan.service'

@Resolver('Plan')
export class PlanResolver {
	public constructor(private readonly planService: PlanService) {}

	@AuthDecoration()
	@Query(() => [PlanModel], { name: 'findMyPlans' })
	public async findMyPlans(@Authorized() user: User) {
		return this.planService.findMyPlans(user)
	}

	@AuthDecoration()
	@Mutation(() => Boolean, { name: 'createPlan' })
	public async create(
		@Authorized() user: User,
		@Args('data') input: CreatePlanInput
	) {
		return this.planService.create(user, input)
	}

	@AuthDecoration()
	@Mutation(() => Boolean, { name: 'removePlan' })
	public async remove(@Args('planId') planId: string) {
		return this.planService.remove(planId)
	}
}
