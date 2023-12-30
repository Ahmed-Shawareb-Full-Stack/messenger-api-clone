import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { FriendRequestsGateway } from './friend-request.controller';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.FRIEND_REQUEST_SERVICE,
      RabbitMQ_Queues.RABBITMQ_FRIEND_REQUEST_QUEUE,
    ),
  ],
  controllers: [FriendRequestsGateway],
})
export class FriendRequestsGatewayModule {}
