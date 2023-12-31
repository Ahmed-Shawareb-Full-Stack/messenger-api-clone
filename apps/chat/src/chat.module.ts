import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Conversation,
  DatabaseModule,
  Message,
  MicroservicesEnum,
  RabbitMQ_Queues,
  RedisModule,
  SharedModule,
  User,
} from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { ChatWebSocketGateway } from './chat.gateway';
// import { UsersToConversations } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.PRESENCE_SERVICE,
      RabbitMQ_Queues.RABBITMQ_PRESENCE_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.CHAT_SERVICE,
      RabbitMQ_Queues.RABBITMQ_CHAT_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.USERS_SERVICE,
      RabbitMQ_Queues.RABBITMQ_USERS_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.FRIEND_REQUEST_SERVICE,
      RabbitMQ_Queues.RABBITMQ_FRIEND_REQUEST_QUEUE,
    ),
    TypeOrmModule.forFeature([Conversation, Message]),
    DatabaseModule,
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatWebSocketGateway],
})
export class ChatModule {}
