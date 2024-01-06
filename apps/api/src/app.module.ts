import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  MicroservicesEnum,
  RabbitMQ_Queues,
  SharedModule,
  UserInfoInterceptor,
} from '@app/shared';
import { AuthGatewayModule } from './auth-gateway/auth.module';
import { APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { router } from './router';
import { PresenceGatewayModule } from './presence-gateway/presence.module';
import { ChatGatewayModule } from './chat_gateway/chat.module';

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
      MicroservicesEnum.USERS_SERVICE,
      RabbitMQ_Queues.RABBITMQ_USERS_QUEUE,
    ),

    SharedModule.registerRmq(
      MicroservicesEnum.FRIEND_REQUEST_SERVICE,
      RabbitMQ_Queues.RABBITMQ_FRIEND_REQUEST_QUEUE,
    ),

    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),

    SharedModule.registerRmq(
      MicroservicesEnum.CHAT_SERVICE,
      RabbitMQ_Queues.RABBITMQ_CHAT_QUEUE,
    ),

    AuthGatewayModule,
    PresenceGatewayModule,
    ChatGatewayModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInfoInterceptor,
    },
  ],
})
export class AppModule {}
