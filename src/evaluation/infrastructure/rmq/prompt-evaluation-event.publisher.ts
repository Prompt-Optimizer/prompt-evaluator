import { Inject, Injectable } from '@nestjs/common';
import type { PromptEvaluatedEvent } from '@prompt-optimizer/common-lib/events';
import { RmqPublisher } from '@prompt-optimizer/common-lib/rmq';

import { PROMPT_EVALUATION_PUBLISHER, ROUTING_KEYS } from '../../constants';

@Injectable()
export class PromptEvaluationEventPublisher {
  constructor(@Inject(PROMPT_EVALUATION_PUBLISHER) private readonly publisher: RmqPublisher) {}

  publishPromptEvaluated(event: PromptEvaluatedEvent): void {
    this.publisher.publish(ROUTING_KEYS.PROMPT_EVALUATED, event);
  }
}
