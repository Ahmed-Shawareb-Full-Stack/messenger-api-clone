import { User } from '../entities';

export interface AuthData {
  token: TokenData;
  user: Partial<User>;
}
export interface TokenData {
  jwtToken: string;
  exp: number;
  iat: number;
}
