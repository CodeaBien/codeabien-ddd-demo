import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../../domain/errors';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/repositories/user-typeorm.repository';
import { FindUserByEmailQuery } from '../queries/find-user-by-email.query';
import { UserQueryResult } from '../queries/user-query-result';

@Injectable()
export class FindUserByEmailHandler {
	constructor(
		@Inject(USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepository
	) {}

	async execute(query: FindUserByEmailQuery): Promise<UserQueryResult> {
		const user = await this.userRepository.findUserByEmailAddress(query.email);

		if (!user) {
			throw new UserNotFoundError(query.email);
		}

		return new UserQueryResult(user.id, user.emailAddress);
	}
}
