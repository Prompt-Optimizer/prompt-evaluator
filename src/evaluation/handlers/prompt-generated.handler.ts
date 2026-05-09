import { Injectable, Logger } from '@nestjs/common';
import type { PromptGeneratedEvent } from '@prompt-optimizer/common-lib/events';

import { PromptEvaluationEventPublisher } from '../infrastructure';

@Injectable()
export class PromptGeneratedHandler {
  private readonly logger = new Logger(PromptGeneratedHandler.name);

  constructor(private readonly publisher: PromptEvaluationEventPublisher) {}

  async execute(event: PromptGeneratedEvent): Promise<void> {
    this.logger.log(`Evaluating prompt ${event.promptId}`);

    // TODO: implement evaluation logic

    this.publisher.publishPromptEvaluated({
      runId: event.runId,
      userId: event.userId,
      timestamp: new Date().toISOString(),
      promptId: event.promptId,
      score: 0,
      metadata: event.metadata,
    });
  }
}
