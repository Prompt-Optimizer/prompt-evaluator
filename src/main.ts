import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigService } from './config';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const configService = app.get(ConfigService);
  const { promptGeneration } = configService.rmq;

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [promptGeneration.url],
        queue: promptGeneration.queue.name,
        noAck: false,
        queueOptions: {
          durable: true,
          arguments: { 'x-queue-type': promptGeneration.queue.type },
        },
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(configService.port, '0.0.0.0');
};

bootstrap();
