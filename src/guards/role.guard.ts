import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from 'src/interfaces/token.interface';

interface RequestWithUser extends Request {
  user: TokenPayload;
}

/**
 * @class AdminOnly
 *
 * Guarda de segurança que restringe o acesso apenas a usuários administradores.
 * Assume que o AuthGuard já validou o token JWT e adicionou user à request.
 * Verifica apenas se o usuário tem a role `ADMIN`.
 *
 * IMPORTANTE: Deve ser usado APÓS AuthGuard na ordem de guards:
 * @UseGuards(AuthGuard, AdminOnly)
 */

@Injectable()
export class AdminOnly implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new ForbiddenException('Acesso negado. Autenticação necessária.');
    }

    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Acesso negado. Apenas administradores podem acessar esta rota.',
      );
    }

    return true;
  }
}
