import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('user')
  async getUser() {
    console.log('first');
    return this.authService.send({ cmd: 'get-user' }, {});
  }
}
