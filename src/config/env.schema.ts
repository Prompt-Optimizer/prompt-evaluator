import { z } from 'zod';

export const ENV = Symbol('ENV');

const exchangeType = z.enum(['direct', 'topic', 'fanout', 'headers']).default('direct');
const queueType = z.enum(['classic', 'quorum', 'stream']).default('quorum');

export const envSchema = z.object({
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  NODE_ENV: z.string().default('development'),

  MONGO_URI: z.string(),

  // AI providers
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  ANTHROPIC_MODEL: z.string(),
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string(),

  // Evaluation
  EVALUATION_MAX_RETRIES: z.coerce.number().int().min(0),
  LLM_JUDGE_MODEL: z.string(),
  EMBEDDING_MODEL: z.string(),

  // This service's exchange
  RMQ_PROMPT_EVALUATION_URL: z.url(),
  RMQ_PROMPT_EVALUATION_EXCHANGE_NAME: z.string(),
  RMQ_PROMPT_EVALUATION_EXCHANGE_TYPE: exchangeType,

  // Prompt Generation service
  RMQ_PROMPT_GENERATION_URL: z.url(),
  RMQ_PROMPT_GENERATION_EXCHANGE_NAME: z.string(),
  RMQ_PROMPT_GENERATION_EXCHANGE_TYPE: exchangeType,
  RMQ_PROMPT_GENERATION_QUEUE_NAME: z.string(),
  RMQ_PROMPT_GENERATION_QUEUE_TYPE: queueType,
});

export type Env = z.infer<typeof envSchema>;
