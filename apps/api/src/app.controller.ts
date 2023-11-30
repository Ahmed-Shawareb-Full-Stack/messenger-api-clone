import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get()
  hi() {
    return {
      hello: 'welcome',
    };
  }

  @Get('user')
  async getUser(): Promise<any> {
    return this.authService.send({ cmd: 'get-user' }, {});
  }
}
