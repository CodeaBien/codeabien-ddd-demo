import { DomainEvent } from './domain-event.interface';

export class UserRegisteredEvent implements DomainEvent {
	readonly eventId: string;
	readonly occurredOn: Date;
	readonly eventType: string = 'UserRegistered';
	readonly version: number = 1;

	constructor(readonly aggregateId: string, readonly email: string, readonly registeredAt: Date) {
		this.eventId = this.generateEventId();
		this.occurredOn = new Date();
	}

	private generateEventId(): string {
		return `user-registered-${this.aggregateId}-${Date.now()}`;
	}
}
