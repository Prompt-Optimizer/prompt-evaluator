import { EvaluationType } from '@prompt-optimizer/common-lib/enums';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class EvaluationConfigDto {
  @IsEnum(EvaluationType)
  type: EvaluationType;

  @ValidateIf((o: EvaluationConfigDto) => o.type === EvaluationType.PARAM_BUILDER)
  @IsNotEmpty()
  rules?: Record<string, unknown>;

  @ValidateIf((o: EvaluationConfigDto) => o.type === EvaluationType.PLAIN_EXPLANATION)
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf((o: EvaluationConfigDto) => o.type === EvaluationType.HARD_OUTPUT)
  @IsString()
  @IsNotEmpty()
  expectedOutput?: string;
}
