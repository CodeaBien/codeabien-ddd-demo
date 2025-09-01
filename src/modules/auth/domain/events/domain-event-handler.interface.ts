import { DomainEvent } from './domain-event.interface';

export interface DomainEventHandler<T extends DomainEvent> {
	handle(event: T): Promise<void>;
	canHandle(event: DomainEvent): boolean;
}
