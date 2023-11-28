import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'AUTH_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const RABBITMQ_USER = configService.get('RABBITMQ_USER');
        const RABBITMQ_PASS = configService.get('RABBITMQ_PASS');
        const RABBITMQ_HOST = configService.get('RABBITMQ_HOST');
        const RABBITMQ_AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`],
            queue: RABBITMQ_AUTH_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class AppModule {}
