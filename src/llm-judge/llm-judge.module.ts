import { Module } from '@nestjs/common';

import { ConfigModule } from '@app/config';

import { LlmJudgeClient } from './services';

@Module({
  imports: [ConfigModule],
  providers: [LlmJudgeClient],
  exports: [LlmJudgeClient],
})
export class LlmJudgeModule {}
