import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, MicroservicesEnum, RegisterDTO } from '@app/shared';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthData } from '@app/shared/types-and-dtos/auth-data.interface';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MicroservicesEnum.USERS_SERVICE)
    private readonly usersService: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async register(data: RegisterDTO) {
    data.password = await this.hashPassword(data.password);
    const ob$ = this.usersService.send({ cmd: 'create-user' }, { data });
    const newUser = await firstValueFrom(ob$).catch((error) =>
      console.log(error),
    );
    return newUser;
  }

  async login(data: LoginDTO) {
    const user = await this.validateUser(data);

    if (!user) {
      return new UnauthorizedException('Invalid credentials');
    }

    delete user.password;

    const tokenPayload = {
      userId: user.id,
    };

    const jwtToken = this.signJwtToken(tokenPayload);

    return {
      user,
      jwtToken,
    };
  }

  async validateUser(data: LoginDTO) {
    const ob$ = this.usersService.send(
      { cmd: 'find-user-by-email' },
      { email: data.email },
    );
    const user = await firstValueFrom(ob$).catch((error) => console.log(error));
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatched = await this.doesPasswordMatched(
      data.password,
      user.password,
    );

    if (!doesPasswordMatched) return null;

    delete user.password;
    return user;
  }

  async getUserFromToken(data: AuthData) {
    const ob$ = this.usersService.send(
      { cmd: 'find-user' },
      { id: data.user.id },
    );
    const user = await firstValueFrom(ob$).catch((error) => console.log(error));

    if (!user) return new BadRequestException('User not found');

    delete user.password;

    data.user = user;

    return data;
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  signJwtToken(payload: any) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get('JWT_PRIVATE_KEY'),
    });
  }

  doesPasswordMatched(inputPassword: string, userPassword: string) {
    return bcrypt.compare(inputPassword, userPassword);
  }

  verifyJwtToken(data: { jwtToken: string }) {
    try {
      if (!data.jwtToken) throw new UnauthorizedException('not a valid token');
      const { userId, exp } = this.jwtService.verify(data.jwtToken);
      return { userId, exp };
    } catch (error) {
      throw new UnauthorizedException('not a valid token2');
    }
  }
}
