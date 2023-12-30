import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { UsersGateway } from './users.controller';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),
  ],
  controllers: [UsersGateway],
})
export class UsersGatewayModule {}
