import { Module } from '@nestjs/common';
import { RmqModule } from '@prompt-optimizer/common-lib/rmq';
import { RmqTopologyModule } from '@prompt-optimizer/common-lib/rmq-topology';

import { ConfigModule, ConfigService } from '@app/config';

import { ROUTING_KEYS } from './constants';
import { PromptGeneratedHandler } from './handlers';
import { PROMPT_EVALUATION_PUBLISHER, PromptEvaluationEventPublisher } from './infrastructure';
import { EvaluationRmqController } from './ui';

@Module({
  imports: [
    ConfigModule,
    RmqModule.registerAsync({
      token: PROMPT_EVALUATION_PUBLISHER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.rmq.promptEvaluation.url,
        exchange: config.rmq.promptEvaluation.exchange,
      }),
    }),
    RmqTopologyModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        bindings: [
          {
            url: config.rmq.promptGeneration.url,
            exchange: config.rmq.promptGeneration.exchange,
            queue: config.rmq.promptGeneration.queue,
            routingKey: ROUTING_KEYS.PROMPT_GENERATED,
          },
        ],
      }),
    }),
  ],
  controllers: [EvaluationRmqController],
  providers: [PromptGeneratedHandler, PromptEvaluationEventPublisher],
})
export class EvaluationModule {}
