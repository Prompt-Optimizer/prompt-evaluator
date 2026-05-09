import { Inject, Injectable } from '@nestjs/common';

import { ENV, type Env } from './env.schema';

@Injectable()
export class ConfigService {
  constructor(@Inject(ENV) private readonly env: Env) {}

  get port(): number {
    return this.env.PORT;
  }

  get rmq() {
    return {
      promptEvaluation: {
        url: this.env.RMQ_PROMPT_EVALUATION_URL,
        exchange: {
          name: this.env.RMQ_PROMPT_EVALUATION_EXCHANGE_NAME,
          type: this.env.RMQ_PROMPT_EVALUATION_EXCHANGE_TYPE,
        },
      },
      promptGeneration: {
        url: this.env.RMQ_PROMPT_GENERATION_URL,
        exchange: {
          name: this.env.RMQ_PROMPT_GENERATION_EXCHANGE_NAME,
          type: this.env.RMQ_PROMPT_GENERATION_EXCHANGE_TYPE,
        },
        queue: {
          name: this.env.RMQ_PROMPT_GENERATION_QUEUE_NAME,
          type: this.env.RMQ_PROMPT_GENERATION_QUEUE_TYPE,
        },
      },
    };
  }
}
