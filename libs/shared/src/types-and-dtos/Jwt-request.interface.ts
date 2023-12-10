import { Request } from 'express';
import { User } from '../entities';

export interface JwtRequest extends Request {
  jwtToken?: string;
  user: Partial<User>;
}
