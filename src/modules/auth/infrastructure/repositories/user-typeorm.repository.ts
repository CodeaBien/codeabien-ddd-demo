import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../core/infraestructure/entities/user.entity';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { UserMapper } from '../mappers/user.mapper';

// Token para inyección de dependencias del repositorio
export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userEntityRepository: Repository<UserEntity>
	) {}

	async findUserByEmailAddress(emailAddress: string): Promise<UserAggregate | null> {
		const userEntity = await this.userEntityRepository.findOne({
			where: { email: emailAddress },
		});

		if (!userEntity) {
			return null;
		}

		return UserMapper.toDomain(userEntity);
	}

	async registerNewUser(userAggregate: UserAggregate): Promise<UserAggregate> {
		const persistenceData = UserMapper.toNewPersistence(userAggregate);
		const newUserEntity = this.userEntityRepository.create(persistenceData);
		const savedEntity = await this.userEntityRepository.save(newUserEntity);

		return UserMapper.toDomain(savedEntity);
	}
}
