import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/repositories/user-typeorm.repository';

export interface UserResponse {
	id: number;
	email: string;
}

@Injectable()
export class UserService {
	constructor(
		@Inject(USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepository
	) {}

	async findByEmail(email: string): Promise<UserResponse> {
		const user = await this.userRepository.findUserByEmailAddress(email);

		if (!user) {
			throw new NotFoundException(`Usuario no encontrado con el email: ${email}`);
		}

		return {
			id: user.id,
			email: user.emailAddress,
		};
	}

	async findById(id: number): Promise<UserResponse> {
		const user = await this.userRepository.findUserById(id);

		if (!user) {
			throw new NotFoundException(`Usuario no encontrado con el ID: ${id}`);
		}

		return {
			id: user.id,
			email: user.emailAddress,
		};
	}
}
