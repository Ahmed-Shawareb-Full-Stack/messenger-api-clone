import { AuthGuard } from '@app/shared';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class UsersGateway {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Get('get-user')
  getUser(): any {
    return this.authService.send({ cmd: 'get-user' }, {});
  }
}
