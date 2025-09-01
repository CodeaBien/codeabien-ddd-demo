import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CONFIG_ENVIRONMENT } from './shared/config/config-env';
import { CONFIG_DATABASE } from './shared/database/config-database';

@Module({
	imports: [CONFIG_ENVIRONMENT, CONFIG_DATABASE, AuthModule],
})
export class AppModule {}
