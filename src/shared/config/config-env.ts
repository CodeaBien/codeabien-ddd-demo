import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';

export const CONFIG_ENVIRONMENT = ConfigModule.forRoot({
	isGlobal: true,
	envFilePath: [
		join(process.cwd(), '.env'),
		join(process.cwd(), '.env.local'),
		join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
	],
	ignoreEnvFile: false,
});
