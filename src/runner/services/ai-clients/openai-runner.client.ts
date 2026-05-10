import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import { ConfigService } from '@app/config';

import { CostService } from '@app/cost/services';

import type { RunResult, RunnerClient } from './interfaces';

@Injectable()
export class OpenaiRunnerClient implements RunnerClient {
  private readonly logger = new Logger(OpenaiRunnerClient.name);
  private readonly client: OpenAI;

  constructor(
    private readonly config: ConfigService,
    private readonly costService: CostService,
  ) {
    this.client = new OpenAI({ apiKey: this.config.ai.openai.apiKey });
  }

  async run(prompt: string, model: string): Promise<RunResult> {
    const start = Date.now();

    const response = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    const executionTimeMs = Date.now() - start;
    const output = response.choices[0]?.message?.content ?? '';
    const tokenUsage = {
      input: response.usage?.prompt_tokens ?? 0,
      output: response.usage?.completion_tokens ?? 0,
      cachedInput: response.usage?.prompt_tokens_details?.cached_tokens ?? 0,
    };

    return {
      output,
      model: response.model,
      tokenUsage,
      cost: this.costService.calculateCost({
        model: response.model,
        inputTokens: tokenUsage.input,
        cachedInputTokens: tokenUsage.cachedInput,
        outputTokens: tokenUsage.output,
      }),
      executionTimeMs,
    };
  }
}
