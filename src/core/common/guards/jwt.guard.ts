import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException({
        message: 'No se encontró el token en la cookie',
      });
    }

    if (!this.validateTokenExpiration(token)) {
      throw new UnauthorizedException({
        message: 'Token de autenticación expirado',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // 🔑 Guardamos el payload en la request para usarlo en los controladores
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        message: 'Token inválido',
      });
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.['jwt']; // 👈 cookie "jwt"
  }

  private validateTokenExpiration(token: string): boolean {
    try {
      const decoded = this.jwtService.decode(token) as { exp: number };
      if (!decoded || !decoded.exp) {
        return false;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }
}