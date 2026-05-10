import { Inject, Injectable, Logger } from '@nestjs/common';

import { PRICING_REPOSITORY, type CostCalculationParams, type PricingRepository } from './interfaces';

@Injectable()
export class CostService {
  private readonly logger = new Logger(CostService.name);

  constructor(@Inject(PRICING_REPOSITORY) private readonly pricingRepository: PricingRepository) {}

  calculateCost(params: CostCalculationParams): number {
    const pricing = this.pricingRepository.get(params.model);

    if (!pricing) {
      this.logger.warn(`No pricing data for model "${params.model}", returning 0`);

      return 0;
    }

    const nonCachedInput = params.inputTokens - params.cachedInputTokens;

    return (
      (nonCachedInput / 1_000_000) * pricing.inputCostPer1M +
      (params.cachedInputTokens / 1_000_000) * pricing.cachedInputCostPer1M +
      (params.outputTokens / 1_000_000) * pricing.outputCostPer1M
    );
  }
}
