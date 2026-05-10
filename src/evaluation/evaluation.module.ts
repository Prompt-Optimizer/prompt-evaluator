import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RmqModule } from '@prompt-optimizer/common-lib/rmq';
import { RmqTopologyModule } from '@prompt-optimizer/common-lib/rmq-topology';

import { ConfigModule, ConfigService } from '@app/config';
import { QualityModule } from '@app/quality/quality.module';
import { RunnerModule } from '@app/runner/runner.module';

import { PROMPT_EVALUATION_PUBLISHER, ROUTING_KEYS } from './constants';
import { EvaluationHandler } from './handlers';
import { PromptEvaluationEventPublisher, PromptResult, PromptResultRepository, PromptResultSchema } from './infrastructure';
import { EvaluationRmqController } from './ui';

@Module({
  imports: [
    ConfigModule,
    RunnerModule,
    QualityModule,
    MongooseModule.forFeature([{ name: PromptResult.name, schema: PromptResultSchema }]),
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
    RmqModule.registerAsync({
      token: PROMPT_EVALUATION_PUBLISHER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.rmq.promptEvaluation.url,
        exchange: config.rmq.promptEvaluation.exchange,
      }),
    }),
  ],
  controllers: [EvaluationRmqController],
  providers: [EvaluationHandler, PromptResultRepository, PromptEvaluationEventPublisher],
})
export class EvaluationModule {}
