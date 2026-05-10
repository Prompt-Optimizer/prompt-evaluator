import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import { ConfigService } from '@app/config';

import type { SimilarityResult } from './interfaces';

@Injectable()
export class OpenaiEmbeddingClient {
  private readonly logger = new Logger(OpenaiEmbeddingClient.name);
  private readonly client: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({ apiKey: this.config.ai.openai.apiKey });
  }

  async computeSimilarity(textA: string, textB: string): Promise<SimilarityResult> {
    const start = Date.now();
    const model = this.config.evaluation.embeddingModel;

    const response = await this.client.embeddings.create({
      model,
      input: [textA, textB],
    });

    const executionTimeMs = Date.now() - start;
    const [embeddingA, embeddingB] = response.data.map((d) => d.embedding);
    const similarity = this.cosineSimilarity(embeddingA, embeddingB);

    return {
      similarity: Math.max(0, similarity),
      metadata: {
        tokenUsage: {
          input: response.usage.prompt_tokens,
          output: 0,
          cachedInput: 0,
        },
        cost: 0,
        executionTimeMs,
      },
    };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);

    return denominator === 0 ? 0 : dotProduct / denominator;
  }
}
