import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { ENV, envSchema } from './env.schema';

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: ENV,
      useFactory: () => envSchema.parse(process.env),
    },
    ConfigService,
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
