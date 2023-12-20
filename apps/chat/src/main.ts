import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMQ_Queues, SharedService } from '@app/shared';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(RabbitMQ_Queues.RABBITMQ_CHAT_QUEUE),
  );

  app.startAllMicroservices();

  await app.listen(configService.get('CHAT_MICROSERVICE_PORT'));
}
bootstrap();
