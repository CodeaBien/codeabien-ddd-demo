export interface QueryBus {
	execute<T>(query: { constructor: { name: string } }): Promise<T>;
}
