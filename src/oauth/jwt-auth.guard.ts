// NOTE: resources are served by another microservice. Do not implement here.
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWT_VALIDATION_ENDPOINT_PLACEHOLDER } from '../modules/rooms/rooms.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    // TODO: integrate with OAuth microservice token validation endpoint.
    // keep placeholder to be replaced when endpoint is available.
    request.oauthValidationEndpoint = JWT_VALIDATION_ENDPOINT_PLACEHOLDER;
    return true;
  }

  private extractToken(request: Record<string, any>): string | undefined {
    const authHeader: string | undefined = request.headers?.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [, token] = authHeader.split(' ');
    return token;
  }
}

