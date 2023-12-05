import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { AuthGateway } from './auth.controller';
import { UsersGatewayModule } from './users/users.module';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq('AUTH_SERVICE', 'RABBITMQ_AUTH_QUEUE'),
    UsersGatewayModule,
  ],
  controllers: [AuthGateway],
  providers: [],
  exports: [],
})
export class AuthGatewayModule {}
