import { Module } from '@nestjs/common';

import { ConfigModule } from '@app/config';
import { CostModule } from '@app/cost/cost.module';

import {
  AiProviderClientFactory,
  AnthropicRunnerClient,
  GeminiRunnerClient,
  ModelResolver,
  OpenaiRunnerClient,
} from './services';
import { PromptRunnerService } from './services/prompt-runner.service';

@Module({
  imports: [ConfigModule, CostModule],
  providers: [
    OpenaiRunnerClient,
    AnthropicRunnerClient,
    GeminiRunnerClient,
    AiProviderClientFactory,
    ModelResolver,
    PromptRunnerService,
  ],
  exports: [PromptRunnerService],
})
export class RunnerModule {}
