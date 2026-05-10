import { Injectable } from '@nestjs/common';

import type { RuleAssessor } from './interfaces';

@Injectable()
export class KeywordsAssessor implements RuleAssessor {
  assess(value: unknown, output: string): number {
    const keywords = Array.isArray(value) ? value : [];
    if (keywords.length === 0) return 1;

    const lowerOutput = output.toLowerCase();
    const matched = keywords.filter((kw) => lowerOutput.includes(String(kw).toLowerCase())).length;

    return matched / keywords.length;
  }
}
