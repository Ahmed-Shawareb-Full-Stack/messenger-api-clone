import { Module } from '@nestjs/common';
import { PresenceGateway } from './presence.controller';
import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.PRESENCE_SERVICE,
      RabbitMQ_Queues.RABBITMQ_PRESENCE_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),
  ],
  controllers: [PresenceGateway],
  providers: [],
  exports: [],
})
export class PresenceGatewayModule {}
