import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';
import { AuthGatewayModule } from './auth-gateway/auth.module';
import { APP_PIPE, RouterModule } from '@nestjs/core';
import { router } from './router';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    RouterModule.register(router),

    SharedModule.registerRmq(
      MicroservicesEnum.PRESENCE_SERVICE,
      RabbitMQ_Queues.RABBITMQ_PRESENCE_QUEUE,
    ),

    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),

    AuthGatewayModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
