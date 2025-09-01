import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import {
	InvalidEmailError,
	TemporaryEmailNotAllowedError,
	UserAlreadyExistsError,
	WeakPasswordError,
} from '../../domain/errors';
import type { DomainEventDispatcher } from '../../domain/events/domain-event-dispatcher.interface';
import { StandardUserRegistrationPolicy } from '../../domain/policies';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/repositories/user-typeorm.repository';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserRegistrationResult } from '../results/user-registration.result';

@Injectable()
export class RegisterUserService {
	private readonly registrationPolicy = new StandardUserRegistrationPolicy();

	constructor(
		@Inject(USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepository,
		@Inject('DomainEventDispatcher')
		private readonly eventDispatcher: DomainEventDispatcher
	) {}

	async execute(command: RegisterUserCommand): Promise<UserRegistrationResult> {
		try {
			// Crear Value Objects (esto lanzará errores de dominio si son inválidos)
			const emailVO = new Email(command.email);
			const passwordVO = new Password(command.password);

			// Aplicar políticas de dominio
			this.registrationPolicy.validateRegistrationContext(emailVO, passwordVO);

			// Verificar que no exista un usuario con el mismo email
			const existingUser = await this.userRepository.findUserByEmailAddress(command.email);
			if (existingUser) {
				throw new UserAlreadyExistsError(command.email);
			}

			// Crear el agregado de usuario (incluye validaciones de dominio y emite eventos)
			const userAggregate = UserAggregate.create(command.email, command.password);

			// Registrar el nuevo usuario en el sistema
			const registeredUser = await this.userRepository.registerNewUser(userAggregate);

			// Publicar eventos de dominio
			const domainEvents = userAggregate.getDomainEvents();
			await this.eventDispatcher.publishAll(domainEvents);
			userAggregate.clearDomainEvents();

			return new UserRegistrationResult(registeredUser.id, registeredUser.emailAddress);
		} catch (error) {
			// Mapear errores de dominio a excepciones HTTP
			if (error instanceof InvalidEmailError) {
				throw new BadRequestException(error.message);
			}
			if (error instanceof WeakPasswordError) {
				throw new BadRequestException(error.message);
			}
			if (error instanceof UserAlreadyExistsError) {
				throw new BadRequestException(error.message);
			}
			if (error instanceof TemporaryEmailNotAllowedError) {
				throw new BadRequestException(error.message);
			}
			throw error;
		}
	}
}
