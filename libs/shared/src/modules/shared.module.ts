import { DynamicModule, Module } from '@nestjs/common';
import { SharedService } from '../services/shared.service';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRmq(provider: string, queueInENV: string): DynamicModule {
    return {
      module: SharedModule,
      providers: [
        {
          provide: provider,
          useFactory: (configService: ConfigService) => {
            const RABBITMQ_USER = configService.get('RABBITMQ_USER');
            const RABBITMQ_PASS = configService.get('RABBITMQ_PASS');
            const RABBITMQ_HOST = configService.get('RABBITMQ_HOST');
            const RABBITMQ_QUEUE = configService.get(queueInENV);
            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [
                  `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`,
                ],
                queue: RABBITMQ_QUEUE,
                queueOptions: {
                  durable: true,
                },
              },
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: [provider],
    };
  }
}
