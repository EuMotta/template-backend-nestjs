import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * @class AdminOnly
 *
 * Guarda de segurança que restringe o acesso apenas a usuários administradores.
 * Verifica o token JWT e garante que o usuário tenha a role `ADMIN` antes de permitir o acesso à rota protegida.
 */

@Injectable()
export class AdminOnly implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Token não fornecido ou inválido');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = this.jwtService.verify(token);
      if (decodedToken.role !== 'ADMIN') {
        throw new ForbiddenException(
          'Acesso negado. Apenas administradores podem acessar esta rota.',
        );
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
