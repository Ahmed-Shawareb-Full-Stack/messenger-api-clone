import { Module } from '@nestjs/common';
import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';
import { AuthGateway } from './auth.controller';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),
  ],
  controllers: [AuthGateway],
})
export class AuthGatewayModule {}
