import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { AuthData } from '../types-and-dtos/auth-data.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') return false;

    const httpRequest = context.switchToHttp().getRequest();

    const authHeaders = httpRequest.headers['authorization'] as string;

    if (!authHeaders) return false;

    const authHeadersParts = authHeaders.split(' ');

    if (!authHeadersParts && authHeadersParts.length !== 2) return false;

    const [, jwtToken] = authHeadersParts;

    return this.authService.send({ cmd: 'verify-jwt' }, { jwtToken }).pipe(
      switchMap((data: AuthData) => {
        const { exp } = data.token;

        if (!data.token.exp) return of(false);

        const TOKEN_EXP_MS = exp * 1000;

        const isJwtValid = Date.now() < TOKEN_EXP_MS;

        return of(isJwtValid);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }
}
