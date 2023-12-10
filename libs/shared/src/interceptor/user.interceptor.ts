import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, switchMap } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') return next.handle();

    const httpRequest = context.switchToHttp().getRequest();

    const authHeaders = httpRequest.headers['authorization'] as string;

    if (!authHeaders) return next.handle();

    const authHeadersParts = authHeaders.split(' ');

    if (!authHeadersParts && authHeadersParts.length !== 2)
      return next.handle();

    const [, jwtToken] = authHeadersParts;

    return this.authService.send({ cmd: 'verify-jwt' }, { jwtToken }).pipe(
      switchMap((data) => (httpRequest.user = data.user)),
      catchError(() => next.handle()),
    );
  }
}
