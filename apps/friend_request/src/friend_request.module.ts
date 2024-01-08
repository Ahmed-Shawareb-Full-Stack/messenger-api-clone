import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend_request.controller';
import { FriendRequestService } from './friend_request.service';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  FriendRequest,
  MicroservicesEnum,
  RabbitMQ_Queues,
  SharedModule,
} from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.FRIEND_REQUEST_SERVICE,
      RabbitMQ_Queues.RABBITMQ_FRIEND_REQUEST_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.USERS_SERVICE,
      RabbitMQ_Queues.RABBITMQ_USERS_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.PRESENCE_SERVICE,
      RabbitMQ_Queues.RABBITMQ_PRESENCE_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),
    TypeOrmModule.forFeature([FriendRequest]),
    DatabaseModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
