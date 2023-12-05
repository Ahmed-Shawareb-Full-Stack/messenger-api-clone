import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { UsersGateway } from './users.controller';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq('AUTH_SERVICE', 'RABBITMQ_AUTH_QUEUE'),
  ],
  controllers: [UsersGateway],
})
export class UsersGatewayModule {}
