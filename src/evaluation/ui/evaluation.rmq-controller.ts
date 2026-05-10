import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqAckInterceptor } from '@prompt-optimizer/common-lib/rmq';

import { ROUTING_KEYS } from '../constants';
import { EvaluationHandler } from '../handlers';

import { PromptGeneratedEventDto } from './dto';

@Controller()
@UseInterceptors(RmqAckInterceptor)
export class EvaluationRmqController {
  constructor(private readonly handler: EvaluationHandler) {}

  @MessagePattern(ROUTING_KEYS.PROMPT_GENERATED)
  async handlePromptGenerated(@Payload() event: PromptGeneratedEventDto): Promise<void> {
    await this.handler.execute(event);
  }
}
