import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class SharedService {
  constructor(private readonly configService: ConfigService) {}

  getRmqOptions(queueInENV: string): RmqOptions {
    const RABBITMQ_USER = this.configService.get('RABBITMQ_USER');
    const RABBITMQ_PASS = this.configService.get('RABBITMQ_PASS');
    const RABBITMQ_HOST = this.configService.get('RABBITMQ_HOST');
    const RABBITMQ_QUEUE = this.configService.get(queueInENV);
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`],
        queue: RABBITMQ_QUEUE,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
