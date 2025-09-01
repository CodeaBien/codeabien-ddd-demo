import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticateUserCommand } from '../../application/commands/authenticate-user.command';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { AuthenticateUserService } from '../../application/services/login-user.service';
import { RegisterUserService } from '../../application/services/register-user.service';
import { AuthenticateUserRequestDto } from '../dto/requests/authenticate-user-request.dto';
import { RegisterUserRequestDto } from '../dto/requests/register-user-request.dto';
import type { AuthenticateUserResponseDto } from '../dto/responses/authenticate-user-response.dto';
import type { RegisterUserResponseDto } from '../dto/responses/register-user-response.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly registerUserService: RegisterUserService,
		private readonly authenticateUserService: AuthenticateUserService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async registerNewUser(@Body() request: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
		const command = new RegisterUserCommand(request.email, request.password);
		const result = await this.registerUserService.execute(command);

		return {
			userId: result.userId,
			email: result.email,
		};
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async authenticateUser(@Body() request: AuthenticateUserRequestDto): Promise<AuthenticateUserResponseDto> {
		const command = new AuthenticateUserCommand(request.email, request.password);
		const result = await this.authenticateUserService.execute(command);

		return {
			userId: result.userId,
			email: result.email,
		};
	}
}
