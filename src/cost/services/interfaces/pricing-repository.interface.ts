import type { ModelPricing } from './model-pricing.interface';

export const PRICING_REPOSITORY = Symbol('PRICING_REPOSITORY');

export interface PricingRepository {
  get(model: string): ModelPricing | undefined;
}
