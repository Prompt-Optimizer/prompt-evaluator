import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { PromptGeneratedEvent } from '@prompt-optimizer/common-lib/events';
import { RmqAckInterceptor } from '@prompt-optimizer/common-lib/rmq';

import { ROUTING_KEYS } from '../constants';
import { PromptGeneratedHandler } from '../handlers';

@Controller()
@UseInterceptors(RmqAckInterceptor)
export class EvaluationRmqController {
  constructor(private readonly handler: PromptGeneratedHandler) {}

  @MessagePattern(ROUTING_KEYS.PROMPT_GENERATED)
  async handlePromptGenerated(@Payload() event: PromptGeneratedEvent): Promise<void> {
    await this.handler.execute(event);
  }
}
