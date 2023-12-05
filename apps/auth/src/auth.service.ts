import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { RegisterDTO } from '@app/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async register(data: RegisterDTO) {
    data.password = await this.hashPassword(data.password);
    return this.usersService.createUser(data);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }
}
