import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO, User } from '@app/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(data: CreateUserDTO) {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      return new ConflictException('User already exists');
    }
    const { password, ...user } = await this.userRepo.save(data);
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async findUser(data: Partial<User>) {
    return await this.userRepo.findOne({
      where: {
        ...data,
      },
    });
  }
}
