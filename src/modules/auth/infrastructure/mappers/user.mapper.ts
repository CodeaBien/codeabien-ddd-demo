import { UserEntity } from '../../../../core/infraestructure/entities/user.entity';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';

export const UserMapper = {
	toDomain(entity: UserEntity): UserAggregate {
		// Asegurar que el ID sea válido
		if (entity.id === undefined || entity.id === null) {
			throw new Error('Entity ID cannot be empty');
		}
		return UserAggregate.reconstituteFromPersistence(entity.id, entity.email, entity.password);
	},

	toPersistence(aggregate: UserAggregate): UserEntity {
		const entity = new UserEntity();
		entity.id = aggregate.id;
		entity.email = aggregate.emailAddress;
		entity.password = aggregate.getPasswordForPersistence();
		return entity;
	},

	toNewPersistence(aggregate: UserAggregate): Omit<UserEntity, 'id'> {
		return {
			email: aggregate.emailAddress,
			password: aggregate.getPasswordForPersistence(),
		};
	},
};
