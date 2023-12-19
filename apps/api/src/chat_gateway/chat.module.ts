import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.controller';
import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.CHAT_SERVICE,
      RabbitMQ_Queues.RABBITMQ_CHAT_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),
  ],
  controllers: [ChatGateway],
  providers: [],
  exports: [],
})
export class ChatGatewayModule {}
