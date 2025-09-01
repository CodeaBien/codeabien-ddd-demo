import { DomainEvent } from './domain-event.interface';

export interface DomainEventDispatcher {
	publish(event: DomainEvent): Promise<void>;
	publishAll(events: DomainEvent[]): Promise<void>;
}
