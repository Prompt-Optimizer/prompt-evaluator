import { Injectable } from '@nestjs/common';
import type { EventMetadata } from '@prompt-optimizer/common-lib/events';

import { LlmJudgeClient } from '@app/llm-judge/services';

import { RuleAssessmentService } from '../rule-assessment';

import type { QualityInput, QualityResult, QualityStrategy } from './interfaces';
import { RULE_JUDGE_SYSTEM_PROMPT } from './prompts';

interface RuleCheckResult {
  name: string;
  value: number;
}

@Injectable()
export class ParamBuilderStrategy implements QualityStrategy {
  constructor(
    private readonly judgeClient: LlmJudgeClient,
    private readonly ruleAssessment: RuleAssessmentService,
  ) {}

  async evaluate(input: QualityInput): Promise<QualityResult> {
    const rules = (input.evaluation.rules ?? {}) as Record<string, unknown>;
    const ruleEntries = Object.entries(rules);

    if (ruleEntries.length === 0) {
      return { quality: 1 };
    }

    const { codeResults, llmRules } = this.partitionRules(ruleEntries, input.actualOutput);
    const { llmResults, metadata } = await this.evaluateLlmRules(llmRules, input.actualOutput);

    const allResults = [...codeResults, ...llmResults];
    const totalQuality = allResults.reduce((sum, r) => sum + r.value, 0) / allResults.length;

    return { quality: totalQuality, metadata };
  }

  private partitionRules(
    ruleEntries: [string, unknown][],
    output: string,
  ): { codeResults: RuleCheckResult[]; llmRules: Record<string, unknown> } {
    const codeResults: RuleCheckResult[] = [];
    const llmRules: Record<string, unknown> = {};

    for (const [key, value] of ruleEntries) {
      if (this.ruleAssessment.isCodeCheckable(key)) {
        codeResults.push({ name: key, value: this.ruleAssessment.assess(key, value, output) });
      } else {
        llmRules[key] = value;
      }
    }

    return { codeResults, llmRules };
  }

  private async evaluateLlmRules(
    llmRules: Record<string, unknown>,
    output: string,
  ): Promise<{ llmResults: RuleCheckResult[]; metadata?: EventMetadata }> {
    const ruleKeys = Object.keys(llmRules);

    if (ruleKeys.length === 0) {
      return { llmResults: [] };
    }

    const rulesDescription = Object.entries(llmRules)
      .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
      .join('\n');

    const userMessage = [
      '## Rules to evaluate:',
      rulesDescription,
      '',
      '## AI response to evaluate:',
      output,
    ].join('\n');

    const result = await this.judgeClient.judgeRules(RULE_JUDGE_SYSTEM_PROMPT, userMessage);

    const llmResults = Object.entries(result.scores).map(([name, score]) => ({ name, value: score }));

    const missingRules = ruleKeys.filter((key) => !result.scores[key]);
    for (const name of missingRules) {
      llmResults.push({ name, value: 0 });
    }

    return { llmResults, metadata: result.metadata };
  }
}
