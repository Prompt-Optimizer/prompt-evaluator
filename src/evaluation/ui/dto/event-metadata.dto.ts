import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min, ValidateNested } from 'class-validator';

class TokenUsageDto {
  @IsInt()
  @Min(0)
  input: number;

  @IsInt()
  @Min(0)
  output: number;

  @IsInt()
  @Min(0)
  cachedInput: number;
}

export class EventMetadataDto {
  @ValidateNested()
  @Type(() => TokenUsageDto)
  tokenUsage: TokenUsageDto;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsNumber()
  @Min(0)
  executionTimeMs: number;
}
