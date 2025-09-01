import { DomainEvent } from './domain-event.interface';

export class UserLoggedInEvent implements DomainEvent {
	readonly eventId: string;
	readonly occurredOn: Date;
	readonly eventType: string = 'UserLoggedIn';
	readonly version: number = 1;

	constructor(
		readonly aggregateId: string,
		readonly email: string,
		readonly loginAt: Date,
		readonly ipAddress?: string,
		readonly userAgent?: string
	) {
		this.eventId = this.generateEventId();
		this.occurredOn = new Date();
	}

	private generateEventId(): string {
		return `user-logged-in-${this.aggregateId}-${Date.now()}`;
	}
}
