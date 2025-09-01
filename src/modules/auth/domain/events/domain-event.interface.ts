export interface DomainEvent {
	readonly eventId: string;
	readonly occurredOn: Date;
	readonly eventType: string;
	readonly aggregateId: string;
	readonly version: number;
}
