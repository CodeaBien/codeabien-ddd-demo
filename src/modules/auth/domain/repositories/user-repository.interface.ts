import { UserAggregate } from '../aggregates/user.aggregate';

export interface UserRepository {
	findUserByEmailAddress(emailAddress: string): Promise<UserAggregate | null>;
	registerNewUser(userAggregate: UserAggregate): Promise<UserAggregate>;
}
