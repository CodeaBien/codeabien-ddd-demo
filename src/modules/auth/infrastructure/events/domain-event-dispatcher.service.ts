import { Injectable, Logger } from '@nestjs/common';
import { UserLoggedInHandler } from '../../application/event-handlers/user-logged-in.handler';
import { UserRegisteredHandler } from '../../application/event-handlers/user-registered.handler';
import { DomainEventDispatcher } from '../../domain/events/domain-event-dispatcher.interface';
import { DomainEventHandler } from '../../domain/events/domain-event-handler.interface';
import { DomainEvent } from '../../domain/events/domain-event.interface';

@Injectable()
export class DomainEventDispatcherService implements DomainEventDispatcher {
	private readonly logger = new Logger(DomainEventDispatcherService.name);
	private readonly handlers: DomainEventHandler<DomainEvent>[] = [];

	constructor(
		private readonly userRegisteredHandler: UserRegisteredHandler,
		private readonly userLoggedInHandler: UserLoggedInHandler
	) {
		this.registerHandlers();
	}

	private registerHandlers(): void {
		this.handlers.push(this.userRegisteredHandler);
		this.handlers.push(this.userLoggedInHandler);
	}

	async publish(event: DomainEvent): Promise<void> {
		this.logger.log(`Publicando evento: ${event.eventType} para agregado: ${event.aggregateId}`);

		const relevantHandlers = this.handlers.filter((handler) => handler.canHandle(event));

		if (relevantHandlers.length === 0) {
			this.logger.warn(`No se encontraron handlers para el evento: ${event.eventType}`);
			return;
		}

		// Ejecutar todos los handlers relevantes
		const handlerPromises = relevantHandlers.map((handler) => this.executeHandler(handler, event));

		await Promise.all(handlerPromises);
	}

	async publishAll(events: DomainEvent[]): Promise<void> {
		this.logger.log(`Publicando ${events.length} eventos`);

		const publishPromises = events.map((event) => this.publish(event));
		await Promise.all(publishPromises);
	}

	private async executeHandler(handler: DomainEventHandler<DomainEvent>, event: DomainEvent): Promise<void> {
		try {
			await handler.handle(event);
			this.logger.log(`Handler ejecutado exitosamente para evento: ${event.eventType}`);
		} catch (error) {
			this.logger.error(`Error ejecutando handler para evento ${event.eventType}:`, error);
			// En un caso real, aquí podríamos implementar retry logic o dead letter queue
			throw error;
		}
	}
}
