import * as fs from 'fs';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import type { ModelPricing, PricingRepository } from '../../services/interfaces';

const MODEL_COSTS_PATH = './model-costs.txt';

@Injectable()
export class FilePricingRepository implements PricingRepository, OnModuleInit {
  private readonly logger = new Logger(FilePricingRepository.name);
  private readonly pricingMap = new Map<string, ModelPricing>();

  onModuleInit(): void {
    this.load();
  }

  get(model: string): ModelPricing | undefined {
    return this.pricingMap.get(model) ?? this.pricingMap.get(this.stripDateSuffix(model));
  }

  private stripDateSuffix(model: string): string {
    return model.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  }

  private load(): void {
    const filePath = MODEL_COSTS_PATH;
    const content = fs.readFileSync(filePath, 'utf-8');

    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    for (const line of lines) {
      const [model, inputCost, cachedCost, outputCost] = line.split('|').map((s) => s.trim());

      if (!model || !inputCost || !cachedCost || !outputCost) continue;

      this.pricingMap.set(model, {
        model,
        inputCostPer1M: parseFloat(inputCost),
        cachedInputCostPer1M: parseFloat(cachedCost),
        outputCostPer1M: parseFloat(outputCost),
      });
    }

    this.logger.log(`Loaded pricing for ${this.pricingMap.size} models from ${filePath}`);
  }
}
