import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from 'src/interfaces/token.interface';

interface RequestWithUser extends Request {
  user: TokenPayload;
}

/**
 * @class AuthGuard
 *
 * Guarda de autenticação JWT para proteger rotas.
 * Verifica a presença e validade do token no cabeçalho da requisição.
 * Se o token for válido, adiciona os dados do usuário ao objeto da requisição.
 */

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_SECRET must be set in environment variables. Application cannot start without it.',
      );
    }
    this.jwtSecret = secret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.jwtSecret,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Sem autorização');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
