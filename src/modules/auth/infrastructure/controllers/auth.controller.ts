import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AuthenticateUserService } from '../../application/services/login-user.service';
import { RegisterUserService } from '../../application/services/register-user.service';
import { UserService } from '../../application/services/user.service';
import { AuthenticateUserRequestDto } from '../dto/requests/authenticate-user-request.dto';
import { RegisterUserRequestDto } from '../dto/requests/register-user-request.dto';
import type { AuthenticateUserResponseDto } from '../dto/responses/authenticate-user-response.dto';
import type { RegisterUserResponseDto } from '../dto/responses/register-user-response.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly registerUserService: RegisterUserService,
		private readonly authenticateUserService: AuthenticateUserService,
		private readonly userService: UserService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async registerNewUser(@Body() request: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
		const result = await this.registerUserService.registerNewUser(request.email, request.password);

		return {
			userId: result.userId,
			email: result.email,
		};
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async loginUser(@Body() request: AuthenticateUserRequestDto): Promise<AuthenticateUserResponseDto> {
		const result = await this.authenticateUserService.loginUser(request.email, request.password);

		return {
			userId: result.userId,
			email: result.email,
		};
	}

	@Get('user/email/:email')
	async findUserByEmail(@Param('email') email: string) {
		return await this.userService.findByEmail(email);
	}

	@Get('user/:id')
	async findUserById(@Param('id', ParseIntPipe) id: number) {
		return await this.userService.findById(id);
	}
}
