import { Injectable, Logger } from '@nestjs/common';
import type { AiProvider } from '@prompt-optimizer/common-lib/enums';
import { SUPPORTED_MODELS, type SupportedModel } from '@prompt-optimizer/common-lib/models';

export interface ResolvedModel {
  id: string;
  provider: AiProvider;
}

@Injectable()
export class ModelResolver {
  private readonly logger = new Logger(ModelResolver.name);

  resolve(evaluationModel?: string): ResolvedModel {
    if (evaluationModel) {
      const found = SUPPORTED_MODELS.find((m) => m.id === evaluationModel);

      if (found) {
        return this.toResolved(found);
      }

      this.logger.warn(`Model "${evaluationModel}" not found in SUPPORTED_MODELS, picking random`);
    }

    return this.pickRandom();
  }

  private pickRandom(): ResolvedModel {
    const index = Math.floor(Math.random() * SUPPORTED_MODELS.length);

    return this.toResolved(SUPPORTED_MODELS[index]);
  }

  private toResolved(model: SupportedModel): ResolvedModel {
    return { id: model.id, provider: model.provider };
  }
}
