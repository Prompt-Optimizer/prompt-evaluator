import Anthropic from '@anthropic-ai/sdk';
import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@app/config';

import { CostService } from '@app/cost/services';

import type { RunResult, RunnerClient } from './interfaces';

// Anthropic API requires max_tokens to be explicitly set (no default)
const ANTHROPIC_MAX_OUTPUT_TOKENS = 16_384;

@Injectable()
export class AnthropicRunnerClient implements RunnerClient {
  private readonly logger = new Logger(AnthropicRunnerClient.name);
  private readonly client: Anthropic;

  constructor(
    private readonly config: ConfigService,
    private readonly costService: CostService,
  ) {
    this.client = new Anthropic({ apiKey: this.config.ai.anthropic.apiKey });
  }

  async run(prompt: string, model: string): Promise<RunResult> {
    const start = Date.now();

    const response = await this.client.messages.create({
      model,
      max_tokens: ANTHROPIC_MAX_OUTPUT_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const executionTimeMs = Date.now() - start;
    const textBlock = response.content.find((block) => block.type === 'text');
    const output = textBlock?.text ?? '';
    const cachedInput = (response.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0;

    return {
      output,
      model: response.model,
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
        cachedInput,
      },
      cost: this.costService.calculateCost({
        model: response.model,
        inputTokens: response.usage.input_tokens,
        cachedInputTokens: cachedInput,
        outputTokens: response.usage.output_tokens,
      }),
      executionTimeMs,
    };
  }
}
