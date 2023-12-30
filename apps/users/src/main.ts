import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { RabbitMQ_Queues, SharedService } from '@app/shared';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(RabbitMQ_Queues.RABBITMQ_USERS_QUEUE),
  );

  app.startAllMicroservices();

  // await app.listen(3000);
}
bootstrap();
