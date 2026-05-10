import { Injectable } from '@nestjs/common';

import { OpenaiEmbeddingClient } from '@app/embedding/services';

import type { QualityInput, QualityResult, QualityStrategy } from './interfaces';

const SHORT_TEXT_WORD_THRESHOLD = 3;

@Injectable()
export class HardOutputStrategy implements QualityStrategy {
  constructor(private readonly embeddingClient: OpenaiEmbeddingClient) {}

  async evaluate(input: QualityInput): Promise<QualityResult> {
    const expected = (input.evaluation.expectedOutput ?? '').trim();
    const actual = input.actualOutput.trim();

    if (!expected) {
      return { quality: 0 };
    }

    const wordCount = expected.split(/\s+/).length;

    if (wordCount < SHORT_TEXT_WORD_THRESHOLD) {
      const quality = expected.toLowerCase() === actual.toLowerCase() ? 1 : 0;

      return { quality };
    }

    const result = await this.embeddingClient.computeSimilarity(expected, actual);

    return {
      quality: result.similarity,
      metadata: result.metadata,
    };
  }
}
