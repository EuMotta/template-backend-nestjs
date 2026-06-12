import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from 'src/interfaces/token.interface';

/**
 * Decorador personalizado para obter o usuário autenticado da requisição.
 *
 * @function GetUser
 * @param {unknown} data - Dados opcionais passados para o decorador (não utilizados).
 * @param {ExecutionContext} ctx - Contexto da execução da requisição.
 * @returns {TokenPayload} Retorna o objeto `user` presente na requisição HTTP.
 *
 * @description
 * Este decorador permite acessar diretamente o usuário autenticado a partir da requisição,
 * assumindo que a autenticação já foi processada por um middleware ou guard.
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: TokenPayload }>();
    return request.user;
  },
);
