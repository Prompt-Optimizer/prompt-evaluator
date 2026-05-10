import type { PromptGeneratedEvent } from '@prompt-optimizer/common-lib/events';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';

import { BaseEventDto } from './base-event.dto';
import { EvaluationConfigDto } from './evaluation-config.dto';
import { EventMetadataDto } from './event-metadata.dto';

export class PromptGeneratedEventDto extends BaseEventDto implements PromptGeneratedEvent {
  @IsUUID()
  promptId: string;

  @IsString()
  @MinLength(1)
  generatedPrompt: string;

  @IsString()
  model: string;

  @ValidateNested()
  @Type(() => EvaluationConfigDto)
  evaluation: EvaluationConfigDto;

  @ValidateNested()
  @Type(() => EventMetadataDto)
  metadata: EventMetadataDto;

  @IsOptional()
  @IsString()
  evaluationModel?: string;
}
