export const RULE_JUDGE_SYSTEM_PROMPT = [
  'You are an expert evaluator. Score how well an AI response satisfies each of the given rules.',
  'For each rule, return a score between 0 and 1.',
  '',
  'Return a JSON object: { "scores": { "ruleName": 0.85, ... } }',
  'Each score must be between 0 (not satisfied at all) and 1 (fully satisfied).',
].join('\n');
