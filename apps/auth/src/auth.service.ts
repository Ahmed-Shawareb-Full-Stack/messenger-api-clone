import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LoginDTO, RegisterDTO } from '@app/shared';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

    return user;
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
}
