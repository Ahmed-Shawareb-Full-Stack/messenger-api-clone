import { NestFactory } from '@nestjs/core';
import { PresenceModule } from './presence.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMQ_Queues, SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);
  app.enableCors();
  const sharedService = app.get(SharedService);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(RabbitMQ_Queues.RABBITMQ_PRESENCE_QUEUE),
  );

  app.startAllMicroservices();

  app.listen(+configService.get('PRESENCE_MICROSERVICE_PORT'));
}
bootstrap();
