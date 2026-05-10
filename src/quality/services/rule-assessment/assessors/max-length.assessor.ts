import { Injectable } from '@nestjs/common';

import type { RuleAssessor } from './interfaces';

@Injectable()
export class MaxLengthAssessor implements RuleAssessor {
  assess(value: unknown, output: string): number {
    const max = Number(value) || Infinity;

    return output.length <= max ? 1 : max / output.length;
  }
}
