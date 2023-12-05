import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '@app/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(data: CreateUserDTO) {
    try {
      const existingUser = await this.findUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      return await this.userRepo.save(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
