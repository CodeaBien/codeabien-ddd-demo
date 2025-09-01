import { Injectable, Logger } from '@nestjs/common';
import { UserLoggedInEvent } from '../../domain/events';
import { DomainEventHandler } from '../../domain/events/domain-event-handler.interface';

@Injectable()
export class UserLoggedInHandler implements DomainEventHandler<UserLoggedInEvent> {
	private readonly logger = new Logger(UserLoggedInHandler.name);

	async handle(event: UserLoggedInEvent): Promise<void> {
		this.logger.log(`Usuario logueado: ${event.email} desde IP: ${event.ipAddress || 'unknown'}`);

		// Aquí podríamos implementar side-effects como:
		// - Actualizar último login
		// - Registrar sesión
		// - Verificar seguridad
		// - Notificar a sistemas de monitoreo

		await this.updateLastLogin(event);
		await this.createUserSession(event);
		await this.checkSecurityAlerts(event);
	}

	canHandle(event: { eventType: string }): boolean {
		return event.eventType === 'UserLoggedIn';
	}

	private async updateLastLogin(event: UserLoggedInEvent): Promise<void> {
		// Simulación de actualización de último login
		this.logger.log(`Actualizando último login para usuario: ${event.aggregateId}`);
		// En un caso real, aquí se actualizaría en la base de datos
	}

	private async createUserSession(event: UserLoggedInEvent): Promise<void> {
		// Simulación de creación de sesión
		this.logger.log(`Creando sesión para usuario: ${event.aggregateId}`);
		// En un caso real, aquí se crearía una sesión en el sistema
	}

	private async checkSecurityAlerts(event: UserLoggedInEvent): Promise<void> {
		// Simulación de verificación de seguridad
		this.logger.log(`Verificando alertas de seguridad para: ${event.email}`);
		// En un caso real, aquí se verificarían patrones sospechosos
	}
}
