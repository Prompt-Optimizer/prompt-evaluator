export interface RuleAssessor {
  assess(value: unknown, output: string): number;
}
