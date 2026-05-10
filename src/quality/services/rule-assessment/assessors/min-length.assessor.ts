import { Injectable } from '@nestjs/common';

import type { RuleAssessor } from './interfaces';

@Injectable()
export class MinLengthAssessor implements RuleAssessor {
  assess(value: unknown, output: string): number {
    const min = Number(value) || 0;

    return output.length >= min ? 1 : output.length / min;
  }
}
