import { Request } from 'express';

export interface JwtRequest extends Request {
  jwtToken?: string;
}
