import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Req } from '@nestjs/common';
import { AuthenticateUserCommand } from '../../application/commands/authenticate-user.command';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { FindUserByEmailQuery, FindUserByIdQuery } from '../../application/queries';
import type { QueryBus } from '../../application/query-bus/query-bus.interface';
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
		private readonly authenticateUserService: AuthenticateUserService,
		@Inject('QueryBus')
		private readonly queryBus: QueryBus
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
	async authenticateUser(
		@Body() request: AuthenticateUserRequestDto,
		@Req() req: { ip?: string; connection?: { remoteAddress?: string }; headers: { [key: string]: string } }
	): Promise<AuthenticateUserResponseDto> {
		const command = new AuthenticateUserCommand(request.email, request.password);

		// Extraer información del request para el contexto de login
		const ipAddress = req.ip || req.connection?.remoteAddress;
		const userAgent = req.headers['user-agent'];

		const result = await this.authenticateUserService.execute(command, ipAddress, userAgent);

		return {
			userId: result.userId,
			email: result.email,
		};
	}

	@Get('user/email/:email')
	async findUserByEmail(@Param('email') email: string) {
		const query = new FindUserByEmailQuery(email);
		return await this.queryBus.execute(query);
	}

	@Get('user/:id')
	async findUserById(@Param('id') id: string) {
		const query = new FindUserByIdQuery(id);
		return await this.queryBus.execute(query);
	}
}
