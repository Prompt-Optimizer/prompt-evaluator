import { Module } from '@nestjs/common';

import { FilePricingRepository } from './infrastructure';
import { CostService, PRICING_REPOSITORY } from './services';

@Module({
  providers: [
    { provide: PRICING_REPOSITORY, useClass: FilePricingRepository },
    CostService,
  ],
  exports: [CostService],
})
export class CostModule {}
