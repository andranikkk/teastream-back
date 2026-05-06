import { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import Stripe from 'stripe'

export const StripeOptionsSymbol = Symbol('StripeOptionsSymbol')

export type TypeStripeOptions = {
	apiKey: string
	config?: ConstructorParameters<typeof Stripe>[1] //**should be -> Stripe.StripeConfig  as in video*/
}

export type TypeStripeAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeStripeOptions>, 'useFactory' | 'inject'>
