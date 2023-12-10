import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LoginDTO, RegisterDTO } from '@app/shared';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthData } from '@app/shared/types-and-dtos/auth-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async register(data: RegisterDTO) {
    data.password = await this.hashPassword(data.password);
    return await this.usersService.createUser(data);
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
    const user = await this.usersService.findUserByEmail(data.email);

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
    const user = await this.usersService.findUser({ id: data.user.id });

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
