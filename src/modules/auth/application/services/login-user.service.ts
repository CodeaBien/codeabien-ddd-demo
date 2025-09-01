import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/repositories/user-typeorm.repository';
import { AuthenticateUserCommand } from '../commands/authenticate-user.command';
import { UserAuthenticationResult } from '../results/user-authentication.result';

@Injectable()
export class AuthenticateUserService {
	constructor(
		@Inject(USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepository
	) {}

	async execute(command: AuthenticateUserCommand): Promise<UserAuthenticationResult> {
		try {
			// Buscar el usuario por su dirección de email
			const userAggregate = await this.userRepository.findUserByEmailAddress(command.email);
			if (!userAggregate) {
				throw new UnauthorizedException('Las credenciales proporcionadas no son válidas');
			}

			// Verificar que las credenciales del usuario sean correctas usando el agregado
			if (!userAggregate.verifyCredentials(command.password)) {
				throw new UnauthorizedException('Las credenciales proporcionadas no son válidas');
			}

			return new UserAuthenticationResult(userAggregate.id, userAggregate.emailAddress);
		} catch (error) {
			if (error instanceof Error && error.message.includes('formato del email')) {
				throw new BadRequestException('El formato del email no es válido para la autenticación');
			}
			throw error;
		}
	}
}
