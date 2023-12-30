import { LoginDTO, MicroservicesEnum, RegisterDTO } from '@app/shared';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AuthGateway {
  constructor(
    @Inject(MicroservicesEnum.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() data: RegisterDTO): any {
    return this.authService.send({ cmd: 'register' }, data);
  }

  @Post('login')
  login(@Body() data: LoginDTO): any {
    return this.authService.send({ cmd: 'login' }, data);
  }
}
