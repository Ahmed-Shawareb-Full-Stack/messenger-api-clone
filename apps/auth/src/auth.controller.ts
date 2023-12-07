import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { LoginDTO, RegisterDTO, SharedService } from '@app/shared';
import { JwtGuard } from './passport/jwt/jwt.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  register(@Ctx() context: RmqContext, @Payload() data: RegisterDTO) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Ctx() context: RmqContext, @Payload() data: LoginDTO) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  // @UseGuards(JwtGuard)
  verifyJwt(
    @Ctx() context: RmqContext,
    @Payload()
    data: {
      jwtToken: string;
    },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.verifyJwtToken(data);
  }
}
