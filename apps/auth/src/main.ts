import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions('RABBITMQ_AUTH_QUEUE'),
  );

  app.startAllMicroservices();
}
bootstrap();
