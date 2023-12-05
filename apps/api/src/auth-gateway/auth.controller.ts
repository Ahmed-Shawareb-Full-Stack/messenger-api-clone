import { RegisterDTO } from '@app/shared';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthGateway {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() data: RegisterDTO): any {
    return this.authService.send({ cmd: 'register' }, data);
  }
}
