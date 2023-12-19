import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';
import { AuthGatewayModule } from './auth-gateway/auth.module';
import { APP_PIPE, RouterModule } from '@nestjs/core';
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
  ],
})
export class AppModule {}
