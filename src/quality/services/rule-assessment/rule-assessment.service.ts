import { Injectable } from '@nestjs/common';

import {
  BannedWordsAssessor,
  KeywordsAssessor,
  MaxLengthAssessor,
  MinLengthAssessor,
  type RuleAssessor,
} from './assessors';

@Injectable()
export class RuleAssessmentService {
  private readonly assessors: Map<string, RuleAssessor>;

  constructor(
    keywords: KeywordsAssessor,
    bannedWords: BannedWordsAssessor,
    minLength: MinLengthAssessor,
    maxLength: MaxLengthAssessor,
  ) {
    this.assessors = new Map<string, RuleAssessor>([
      ['keywords', keywords],
      ['bannedWords', bannedWords],
      ['minLength', minLength],
      ['maxLength', maxLength],
    ]);
  }

  isCodeCheckable(ruleName: string): boolean {
    return this.assessors.has(ruleName);
  }

  assess(ruleName: string, value: unknown, output: string): number {
    const assessor = this.assessors.get(ruleName);

    if (!assessor) {
      throw new Error(`No assessor registered for rule: ${ruleName}`);
    }

    return assessor.assess(value, output);
  }
}
