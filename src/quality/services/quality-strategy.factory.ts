import { Injectable } from '@nestjs/common';
import { EvaluationType } from '@prompt-optimizer/common-lib/enums';

import { HardOutputStrategy } from './strategies/hard-output.strategy';
import type { QualityStrategy } from './strategies/interfaces';
import { ParamBuilderStrategy } from './strategies/param-builder.strategy';
import { PlainExplanationStrategy } from './strategies/plain-explanation.strategy';

@Injectable()
export class QualityStrategyFactory {
  private readonly strategies: Map<EvaluationType, QualityStrategy>;

  constructor(
    paramBuilder: ParamBuilderStrategy,
    plainExplanation: PlainExplanationStrategy,
    hardOutput: HardOutputStrategy,
  ) {
    this.strategies = new Map<EvaluationType, QualityStrategy>([
      [EvaluationType.PARAM_BUILDER, paramBuilder],
      [EvaluationType.PLAIN_EXPLANATION, plainExplanation],
      [EvaluationType.HARD_OUTPUT, hardOutput],
    ]);
  }

  get(type: EvaluationType): QualityStrategy {
    const strategy = this.strategies.get(type);

    if (!strategy) {
      throw new Error(`Unsupported evaluation type: ${type}`);
    }

    return strategy;
  }
}
