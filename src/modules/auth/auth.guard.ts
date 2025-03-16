import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const accessToken = this.getTokenFromRequest(request);
    if (accessToken) {
      const payload = this.jwtService.verify(accessToken);
      request.user = payload;
      if (requiredRoles && requiredRoles.includes(payload.role)) {
        return true;
      }
    }
    if (requiredRoles) {
      throw new UnauthorizedException();
    }

    return true;
  }

  getTokenFromRequest(request: Request) {
    try {
      const [prefix, token] = request.cookies.authorization.split(' ');
      if (prefix === 'Bearer') {
        return token;
      }
    } catch {
      return;
    }
  }
}
