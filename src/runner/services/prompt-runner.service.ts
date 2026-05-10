import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@app/config';

import type { RunResult } from './ai-clients';
import { AiProviderClientFactory } from './ai-clients';
import { ModelResolver, type ResolvedModel } from './model-resolver';

export interface PromptRunResult extends RunResult {
  resolvedModel: ResolvedModel;
}

@Injectable()
export class PromptRunnerService {
  private readonly logger = new Logger(PromptRunnerService.name);

  constructor(
    private readonly modelResolver: ModelResolver,
    private readonly clientFactory: AiProviderClientFactory,
    private readonly config: ConfigService,
  ) {}

  async run(prompt: string, evaluationModel?: string): Promise<PromptRunResult> {
    const resolved = this.modelResolver.resolve(evaluationModel);
    this.logger.log(`Running prompt on model=${resolved.id}`);

    const client = this.clientFactory.get(resolved.provider);
    const result = await this.executeWithRetry(() => client.run(prompt, resolved.id));

    return { ...result, resolvedModel: resolved };
  }

  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    const maxRetries = this.config.evaluation.maxRetries;
    let lastError = new Error('Run failed after all retries');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * 2 ** attempt, 10_000);
          this.logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms: ${lastError.message}`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}
