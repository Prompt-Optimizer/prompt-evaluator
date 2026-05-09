import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [ConfigModule, EvaluationModule],
})
export class AppModule {}
