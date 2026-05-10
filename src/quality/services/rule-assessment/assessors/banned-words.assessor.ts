import { Injectable } from '@nestjs/common';

import type { RuleAssessor } from './interfaces';

@Injectable()
export class BannedWordsAssessor implements RuleAssessor {
  assess(value: unknown, output: string): number {
    const banned = Array.isArray(value) ? value : [];
    if (banned.length === 0) return 1;

    const lowerOutput = output.toLowerCase();
    const found = banned.filter((bw) => lowerOutput.includes(String(bw).toLowerCase())).length;

    return found === 0 ? 1 : 1 - found / banned.length;
  }
}
