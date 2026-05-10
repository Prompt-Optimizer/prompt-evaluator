import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from './config';
import { RunnerModule } from './runner/runner.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongo.uri,
      }),
      inject: [ConfigService],
    }),
    RunnerModule,
  ],
})
export class AppModule {}
