# prompt-evaluator

Prompt evaluation service. For each generated prompt variant it computes three metrics — quality score via LLM judge, embedding similarity to the original, and token cost — then publishes the results to the aggregator.

## Stack

- NestJS + Fastify
- MongoDB (evaluation results)
- RabbitMQ `optimization-rabbitmq`:
  - Consumes: `ex.prompt-generation.events` → `q.prompt-evaluation.prompt-generation`
  - Publishes: `ex.prompt-evaluation.events`
- OpenAI (LLM judge + embeddings)
- Anthropic / Gemini (optional evaluator models)

## Setup

```bash
cp .env.dist .env
# fill in MONGO_URI, OPENAI_API_KEY (required), ANTHROPIC_API_KEY, GEMINI_API_KEY
npm install
```

Start infrastructure first:

```bash
cd ../local-infra && docker compose up -d
```

## Run

```bash
npm run start:dev   # development
npm run start:prod  # production
```

Listens on `PORT` (default **3000**).

## Key env vars

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `OPENAI_API_KEY` | Required for LLM judge and embeddings |
| `OPENAI_MODEL` | Model for test execution (default `gpt-4o`) |
| `LLM_JUDGE_MODEL` | Model for quality scoring (default `gpt-4o-mini`) |
| `EMBEDDING_MODEL` | Embedding model (default `text-embedding-3-small`) |
| `ANTHROPIC_API_KEY` | Optional — for Anthropic model evaluation |
| `GEMINI_API_KEY` | Optional — for Gemini model evaluation |
| `EVALUATION_MAX_RETRIES` | Max retries on LLM failure (default `3`) |
| `RMQ_URL` | `amqp://admin:password@localhost:5672` |
