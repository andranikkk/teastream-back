import { Module } from '@nestjs/common'

import { VerificationService } from '../verification/verification.service'

import { PasswordRecoveryResolver } from './password-recovery.resolver'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	providers: [
		PasswordRecoveryResolver,
		PasswordRecoveryService,
		VerificationService
	]
})
export class PasswordRecoveryModule {}
