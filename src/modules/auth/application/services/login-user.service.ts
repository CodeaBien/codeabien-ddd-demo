import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InvalidCredentialsError, InvalidEmailError, UserNotFoundError } from '../../domain/errors';
import type { DomainEventDispatcher } from '../../domain/events/domain-event-dispatcher.interface';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/repositories/user-typeorm.repository';
import { AuthenticateUserCommand } from '../commands/authenticate-user.command';
import { UserAuthenticationResult } from '../results/user-authentication.result';

@Injectable()
export class AuthenticateUserService {
	constructor(
		@Inject(USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepository,
		@Inject('DomainEventDispatcher')
		private readonly eventDispatcher: DomainEventDispatcher
	) {}

	async execute(
		command: AuthenticateUserCommand,
		ipAddress?: string,
		userAgent?: string
	): Promise<UserAuthenticationResult> {
		try {
			// Validar formato del email usando Value Object
			new Email(command.email);

			// Buscar el usuario por su dirección de email
			const userAggregate = await this.userRepository.findUserByEmailAddress(command.email);
			if (!userAggregate) {
				throw new UserNotFoundError(command.email);
			}

			// Verificar que las credenciales del usuario sean correctas usando el agregado
			if (!userAggregate.verifyCredentials(command.password)) {
				throw new InvalidCredentialsError();
			}

			// Realizar login (esto emitirá el evento de dominio)
			userAggregate.login(ipAddress, userAgent);

			// Publicar eventos de dominio
			const domainEvents = userAggregate.getDomainEvents();
			await this.eventDispatcher.publishAll(domainEvents);
			userAggregate.clearDomainEvents();

			return new UserAuthenticationResult(userAggregate.id, userAggregate.emailAddress);
		} catch (error) {
			// Mapear errores de dominio a excepciones HTTP
			if (error instanceof InvalidEmailError) {
				throw new BadRequestException(error.message);
			}
			if (error instanceof UserNotFoundError) {
				throw new UnauthorizedException('Las credenciales proporcionadas no son válidas');
			}
			if (error instanceof InvalidCredentialsError) {
				throw new UnauthorizedException('Las credenciales proporcionadas no son válidas');
			}
			throw error;
		}
	}
}
