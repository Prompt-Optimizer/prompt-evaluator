import { Inject, Injectable } from '@nestjs/common';

import { ENV, type Env } from './env.schema';

@Injectable()
export class ConfigService {
  constructor(@Inject(ENV) private readonly env: Env) {}

  get port(): number {
    return this.env.PORT;
  }

  get mongo() {
    return {
      uri: this.env.MONGO_URI,
    };
  }

  get ai() {
    return {
      openai: {
        apiKey: this.env.OPENAI_API_KEY,
        model: this.env.OPENAI_MODEL,
      },
      anthropic: {
        apiKey: this.env.ANTHROPIC_API_KEY,
        model: this.env.ANTHROPIC_MODEL,
      },
      gemini: {
        apiKey: this.env.GEMINI_API_KEY,
        model: this.env.GEMINI_MODEL,
      },
    };
  }

  get evaluation() {
    return {
      maxRetries: this.env.EVALUATION_MAX_RETRIES,
      llmJudgeModel: this.env.LLM_JUDGE_MODEL,
      embeddingModel: this.env.EMBEDDING_MODEL,
    };
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
