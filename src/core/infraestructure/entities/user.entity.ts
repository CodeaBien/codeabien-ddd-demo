import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	email: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	password: string;
}
