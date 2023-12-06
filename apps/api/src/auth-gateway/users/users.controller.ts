import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class UsersGateway {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('get-user')
  getUser(): any {
    return this.authService.send({ cmd: 'get-user' }, {});
  }
}
