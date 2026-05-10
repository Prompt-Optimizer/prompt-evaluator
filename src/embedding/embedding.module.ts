import { Module } from '@nestjs/common';

import { ConfigModule } from '@app/config';

import { OpenaiEmbeddingClient } from './services';

@Module({
  imports: [ConfigModule],
  providers: [OpenaiEmbeddingClient],
  exports: [OpenaiEmbeddingClient],
})
export class EmbeddingModule {}
