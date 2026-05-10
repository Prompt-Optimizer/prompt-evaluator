import type { BaseEvent } from '@prompt-optimizer/common-lib/events';
import { IsString, IsUUID } from 'class-validator';

export class BaseEventDto implements BaseEvent {
  @IsUUID()
  runId: string;

  @IsString()
  userId: string;

  @IsString()
  timestamp: string;
}
