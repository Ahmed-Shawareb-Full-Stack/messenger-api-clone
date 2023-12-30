import { NestFactory } from '@nestjs/core';
import { FriendRequestModule } from './friend_request.module';
import { RabbitMQ_Queues, SharedService } from '@app/shared';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(FriendRequestModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(RabbitMQ_Queues.RABBITMQ_FRIEND_REQUEST_QUEUE),
  );

  app.startAllMicroservices();

  // await app.listen(3000);
}
bootstrap();
