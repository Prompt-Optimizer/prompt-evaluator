import { Injectable } from '@nestjs/common';
import { AiProvider } from '@prompt-optimizer/common-lib/enums';

import { AnthropicRunnerClient } from './anthropic-runner.client';
import { GeminiRunnerClient } from './gemini-runner.client';
import type { RunnerClient } from './interfaces';
import { OpenaiRunnerClient } from './openai-runner.client';

@Injectable()
export class AiProviderClientFactory {
  private readonly clients: Map<AiProvider, RunnerClient>;

  constructor(openai: OpenaiRunnerClient, anthropic: AnthropicRunnerClient, gemini: GeminiRunnerClient) {
    this.clients = new Map<AiProvider, RunnerClient>([
      [AiProvider.OPENAI, openai],
      [AiProvider.ANTHROPIC, anthropic],
      [AiProvider.GEMINI, gemini],
    ]);
  }

  get(provider: AiProvider): RunnerClient {
    const client = this.clients.get(provider);

    if (!client) {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    return client;
  }
}
