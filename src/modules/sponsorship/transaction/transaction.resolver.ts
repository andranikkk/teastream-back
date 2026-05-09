import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/client'

import { AuthDecoration } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { MakePaymentModel } from './models/make-payment.model'
import { TransactionModel } from './models/transaction.model'
import { TransactionService } from './transaction.service'

@Resolver('Transaction')
export class TransactionResolver {
	public constructor(
		private readonly transactionService: TransactionService
	) {}

	@AuthDecoration()
	@Query(() => [TransactionModel], { name: 'findMyTransactions' })
	public async findMyTransactions(@Authorized() user: User) {
		return this.transactionService.findMyTransactions(user)
	}

	@AuthDecoration()
	@Mutation(() => MakePaymentModel, { name: 'makePayment' })
	public async makePayment(
		@Authorized() user: User,
		@Args('planId') planId: string
	) {
		return this.transactionService.makePayment(user, planId)
	}
}
