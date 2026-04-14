import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),

		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI'),
			}),
		}),

		SnippetsModule,
	],
})
export class AppModule {}
