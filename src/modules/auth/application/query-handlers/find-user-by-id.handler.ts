import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../../domain/errors';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/repositories/user-typeorm.repository';
import { FindUserByIdQuery } from '../queries/find-user-by-id.query';
import { UserQueryResult } from '../queries/user-query-result';

@Injectable()
export class FindUserByIdHandler {
	constructor(
		@Inject(USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepository
	) {}

	async execute(query: FindUserByIdQuery): Promise<UserQueryResult> {
		const user = await this.userRepository.findUserById(query.userId);

		if (!user) {
			throw new UserNotFoundError(`ID: ${query.userId}`);
		}

		return new UserQueryResult(user.id, user.emailAddress);
	}
}
