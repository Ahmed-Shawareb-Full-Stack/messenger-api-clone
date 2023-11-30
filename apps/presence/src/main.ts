import { NestFactory } from '@nestjs/core';
import { PresenceModule } from './presence.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);

  const sharedService = app.get(SharedService);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions('RABBITMQ_PRESENCE_QUEUE'),
  );

  app.startAllMicroservices();
}
bootstrap();
