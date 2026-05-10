import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@app/config';

import { CostService } from '@app/cost/services';

import type { RunResult, RunnerClient } from './interfaces';

@Injectable()
export class GeminiRunnerClient implements RunnerClient {
  private readonly logger = new Logger(GeminiRunnerClient.name);
  private readonly client: GoogleGenerativeAI;

  constructor(
    private readonly config: ConfigService,
    private readonly costService: CostService,
  ) {
    this.client = new GoogleGenerativeAI(this.config.ai.gemini.apiKey);
  }

  async run(prompt: string, model: string): Promise<RunResult> {
    const start = Date.now();

    const generativeModel = this.client.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;

    const executionTimeMs = Date.now() - start;
    const output = response.text();
    const usage = response.usageMetadata;
    const inputTokens = usage?.promptTokenCount ?? 0;
    const cachedInputTokens = usage?.cachedContentTokenCount ?? 0;
    const outputTokens = usage?.candidatesTokenCount ?? 0;

    return {
      output,
      model,
      tokenUsage: { input: inputTokens, output: outputTokens, cachedInput: cachedInputTokens },
      cost: this.costService.calculateCost({ model, inputTokens, cachedInputTokens, outputTokens }),
      executionTimeMs,
    };
  }
}
