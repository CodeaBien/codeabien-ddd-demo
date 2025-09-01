import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../core/infraestructure/entities/user.entity';
import { UserLoggedInHandler } from './application/event-handlers/user-logged-in.handler';
import { UserRegisteredHandler } from './application/event-handlers/user-registered.handler';
import { QueryBusService } from './application/query-bus/query-bus.service';
import { FindUserByEmailHandler } from './application/query-handlers/find-user-by-email.handler';
import { FindUserByIdHandler } from './application/query-handlers/find-user-by-id.handler';
import { AuthenticateUserService } from './application/services/login-user.service';
import { RegisterUserService } from './application/services/register-user.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { DomainEventDispatcherService } from './infrastructure/events/domain-event-dispatcher.service';
import { TypeOrmUserRepository, USER_REPOSITORY_TOKEN } from './infrastructure/repositories/user-typeorm.repository';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [AuthController],
	providers: [
		{
			provide: USER_REPOSITORY_TOKEN,
			useClass: TypeOrmUserRepository,
		},
		RegisterUserService,
		AuthenticateUserService,
		// Event handlers
		UserRegisteredHandler,
		UserLoggedInHandler,
		// Event dispatcher
		{
			provide: 'DomainEventDispatcher',
			useClass: DomainEventDispatcherService,
		},
		// Query handlers
		FindUserByEmailHandler,
		FindUserByIdHandler,
		// Query bus
		{
			provide: 'QueryBus',
			useClass: QueryBusService,
		},
	],
})
export class AuthModule {}
