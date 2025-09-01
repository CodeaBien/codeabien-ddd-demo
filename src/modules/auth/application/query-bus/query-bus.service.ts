import { Injectable, Logger } from '@nestjs/common';
import { FindUserByEmailQuery } from '../queries/find-user-by-email.query';
import { FindUserByIdQuery } from '../queries/find-user-by-id.query';
import { FindUserByEmailHandler } from '../query-handlers/find-user-by-email.handler';
import { FindUserByIdHandler } from '../query-handlers/find-user-by-id.handler';
import { QueryBus } from './query-bus.interface';

@Injectable()
export class QueryBusService implements QueryBus {
	private readonly logger = new Logger(QueryBusService.name);

	constructor(
		private readonly findUserByEmailHandler: FindUserByEmailHandler,
		private readonly findUserByIdHandler: FindUserByIdHandler
	) {}

	async execute<T>(query: { constructor: { name: string } }): Promise<T> {
		this.logger.log(`Ejecutando query: ${query.constructor.name}`);

		if (query instanceof FindUserByEmailQuery) {
			return this.findUserByEmailHandler.execute(query) as Promise<T>;
		}

		if (query instanceof FindUserByIdQuery) {
			return this.findUserByIdHandler.execute(query) as Promise<T>;
		}

		throw new Error(`No se encontró handler para la query: ${query.constructor.name}`);
	}
}
