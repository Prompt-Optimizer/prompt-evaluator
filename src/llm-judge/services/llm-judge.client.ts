import { Injectable, Logger } from '@nestjs/common';
import type { EventMetadata } from '@prompt-optimizer/common-lib/events';
import OpenAI from 'openai';

import { ConfigService } from '@app/config';

import type { JudgeResult } from './interfaces/judge-result.interface';
import type { RuleJudgeResult } from './interfaces/rule-judge-result.interface';

@Injectable()
export class LlmJudgeClient {
  private readonly logger = new Logger(LlmJudgeClient.name);
  private readonly client: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({ apiKey: this.config.ai.openai.apiKey });
  }

  async judge(systemPrompt: string, userMessage: string): Promise<JudgeResult> {
    const start = Date.now();
    const response = await this.callLlm(systemPrompt, userMessage);
    const metadata = this.extractMetadata(response, Date.now() - start);

    const content = response.choices[0]?.message?.content ?? '{}';
    const score = this.parseScore(content);

    return { score, metadata };
  }

  async judgeRules(systemPrompt: string, userMessage: string): Promise<RuleJudgeResult> {
    const start = Date.now();
    const response = await this.callLlm(systemPrompt, userMessage);
    const metadata = this.extractMetadata(response, Date.now() - start);

    const content = response.choices[0]?.message?.content ?? '{}';
    const scores = this.parseRuleScores(content);

    return { scores, metadata };
  }

  private async callLlm(systemPrompt: string, userMessage: string): Promise<OpenAI.Chat.ChatCompletion> {
    const model = this.config.evaluation.llmJudgeModel;

    return this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
    });
  }

  private extractMetadata(response: OpenAI.Chat.ChatCompletion, executionTimeMs: number): EventMetadata {
    return {
      tokenUsage: {
        input: response.usage?.prompt_tokens ?? 0,
        output: response.usage?.completion_tokens ?? 0,
        cachedInput: response.usage?.prompt_tokens_details?.cached_tokens ?? 0,
      },
      cost: 0,
      executionTimeMs,
    };
  }

  private parseScore(content: string): number {
    try {
      const parsed = JSON.parse(content) as { score?: number };
      const score = parsed.score ?? 0;

      return Math.max(0, Math.min(1, score));
    } catch {
      this.logger.warn('Failed to parse LLM judge response');

      return 0;
    }
  }

  private parseRuleScores(content: string): Record<string, number> {
    try {
      const parsed = JSON.parse(content) as { scores?: Record<string, number> };

      if (!parsed.scores || typeof parsed.scores !== 'object') return {};

      const result: Record<string, number> = {};

      for (const [key, value] of Object.entries(parsed.scores)) {
        result[key] = Math.max(0, Math.min(1, typeof value === 'number' ? value : 0));
      }

      return result;
    } catch {
      this.logger.warn('Failed to parse LLM judge rule scores');

      return {};
    }
  }
}
