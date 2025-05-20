import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador personalizado para obter o usuário autenticado da requisição.
 *
 * @function GetUser
 * @param {unknown} data - Dados opcionais passados para o decorador (não utilizados).
 * @param {ExecutionContext} ctx - Contexto da execução da requisição.
 * @returns {any} Retorna o objeto `user` presente na requisição HTTP.
 *
 * @description
 * Este decorador permite acessar diretamente o usuário autenticado a partir da requisição,
 * assumindo que a autenticação já foi processada por um middleware ou guard.
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
