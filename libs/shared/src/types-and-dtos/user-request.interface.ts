import { Request } from 'express';
import { User } from '../entities';

export interface UserRequest extends Request {
  user: Partial<User>;
}
