import { Injectable, Logger } from '@nestjs/common';
import { UserRegisteredEvent } from '../../domain/events';
import { DomainEventHandler } from '../../domain/events/domain-event-handler.interface';

@Injectable()
export class UserRegisteredHandler implements DomainEventHandler<UserRegisteredEvent> {
	private readonly logger = new Logger(UserRegisteredHandler.name);

	async handle(event: UserRegisteredEvent): Promise<void> {
		this.logger.log(`Usuario registrado: ${event.email} en ${event.registeredAt.toISOString()}`);

		// Aquí podríamos implementar side-effects como:
		// - Enviar email de bienvenida
		// - Crear perfil de usuario
		// - Registrar en sistema de analytics
		// - Notificar a otros servicios

		// Ejemplo de side-effect simulado
		await this.sendWelcomeEmail(event.email);
		await this.createUserProfile(event.aggregateId);
		await this.trackUserRegistration(event);
	}

	canHandle(event: { eventType: string }): boolean {
		return event.eventType === 'UserRegistered';
	}

	private async sendWelcomeEmail(email: string): Promise<void> {
		// Simulación de envío de email
		this.logger.log(`Enviando email de bienvenida a: ${email}`);
		// En un caso real, aquí se integraría con un servicio de email
	}

	private async createUserProfile(userId: string): Promise<void> {
		// Simulación de creación de perfil
		this.logger.log(`Creando perfil para usuario: ${userId}`);
		// En un caso real, aquí se crearía un perfil en otro agregado
	}

	private async trackUserRegistration(event: UserRegisteredEvent): Promise<void> {
		// Simulación de tracking
		this.logger.log(`Tracking registro de usuario: ${event.eventId}`);
		// En un caso real, aquí se enviaría a un sistema de analytics
	}
}
