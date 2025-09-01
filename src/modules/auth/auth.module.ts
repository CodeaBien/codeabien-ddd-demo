import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../core/infraestructure/entities/user.entity';
import { AuthenticateUserService } from './application/services/login-user.service';
import { RegisterUserService } from './application/services/register-user.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
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
	],
})
export class AuthModule {}
