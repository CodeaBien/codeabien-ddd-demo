import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const CONFIG_DATABASE = TypeOrmModule.forRootAsync({
	useFactory: (configService: ConfigService) => {
		return {
			type: 'postgres',
			host: configService.get<string>('POSTGRES_HOST'),
			port: configService.get<number>('PGPORT'),
			username: configService.get<string>('POSTGRES_USER'),
			password: configService.get<string>('POSTGRES_PASSWORD'),
			database: configService.get<string>('POSTGRES_DB'),
			entities: [`${__dirname}/../../**/*.entity.{ts,js}`],
			synchronize: false,
			logging: false,
		};
	},
	inject: [ConfigService],
});
