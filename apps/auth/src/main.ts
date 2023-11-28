import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const RABBITMQ_USER = configService.get('RABBITMQ_USER');
  const RABBITMQ_PASS = configService.get('RABBITMQ_PASS');
  const RABBITMQ_HOST = configService.get('RABBITMQ_HOST');
  const RABBITMQ_AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`],
      queue: RABBITMQ_AUTH_QUEUE,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.startAllMicroservices();
}
bootstrap();
