// NOTE: resources are served by another microservice. Do not implement here.
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWT_VALIDATION_ENDPOINT_PLACEHOLDER } from '../modules/rooms/rooms.constants';
import axios from 'axios';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.canActivateAsync(context);
  }

  private async canActivateAsync(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Development shortcut: skip validation when DISABLE_AUTH=true
    if (process.env.DISABLE_AUTH === 'true') {
      // attach a minimal user object so downstream handlers that expect it won't fail
      request.user = { sub: 'dev', roles: [] };
      return true;
    }

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const validationEndpoint =
      process.env.OAUTH_VALIDATE_URL ?? JWT_VALIDATION_ENDPOINT_PLACEHOLDER;

    try {
      // Call the OAuth microservice validate endpoint. The oauth service
      // expects the token in the Authorization header (Bearer <token>).
      const response = await axios.post(
        validationEndpoint,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // attach introspection result to request for downstream handlers
      request.user = response.data;
      request.oauthValidationEndpoint = validationEndpoint;
      return true;
    } catch (err) {
      // map any validation failure to Unauthorized
      throw new UnauthorizedException('Invalid or expired token');
    }
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

