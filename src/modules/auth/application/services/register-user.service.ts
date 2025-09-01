import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/repositories/user-typeorm.repository';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserRegistrationResult } from '../results/user-registration.result';

@Injectable()
export class RegisterUserService {
	constructor(
		@Inject(USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepository
	) {}

	async execute(command: RegisterUserCommand): Promise<UserRegistrationResult> {
		try {
			// Crear el agregado de usuario (incluye validaciones de dominio)
			const userAggregate = UserAggregate.create(command.email, command.password);

			// Verificar que no exista un usuario con el mismo email
			const existingUser = await this.userRepository.findUserByEmailAddress(command.email);
			if (existingUser) {
				throw new BadRequestException('Ya existe un usuario registrado con este email');
			}

			// Registrar el nuevo usuario en el sistema
			const registeredUser = await this.userRepository.registerNewUser(userAggregate);

			return new UserRegistrationResult(registeredUser.id, registeredUser.emailAddress);
		} catch (error) {
			if (error instanceof Error && error.message.includes('formato del email')) {
				throw new BadRequestException('El formato del email no es válido para el registro');
			}
			if (error instanceof Error && error.message.includes('requisitos mínimos de seguridad')) {
				throw new BadRequestException(
					'La contraseña debe cumplir los requisitos mínimos de seguridad (mínimo 6 caracteres)'
				);
			}
			throw error;
		}
	}
}
