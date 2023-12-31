import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import {
  MicroservicesEnum,
  RabbitMQ_Queues,
  RedisModule,
  SharedModule,
} from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresenceWebSocketGateway } from './presence.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.FRIEND_REQUEST_SERVICE,
      RabbitMQ_Queues.RABBITMQ_FRIEND_REQUEST_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.AUTH_SERVICE,
      RabbitMQ_Queues.RABBITMQ_AUTH_QUEUE,
    ),
    DatabaseModule,
    RedisModule,
  ],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceWebSocketGateway],
})
export class PresenceModule {}
