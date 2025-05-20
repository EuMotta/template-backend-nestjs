import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de logging para monitorar requisições HTTP.
 *
 * @class LoggingMiddleware
 * @implements {NestMiddleware}
 *
 * @method use
 * @param {Request} req - Objeto da requisição HTTP.
 * @param {Response} res - Objeto da resposta HTTP.
 * @param {NextFunction} next - Função para passar o controle ao próximo middleware.
 *
 * @description
 * Este middleware registra informações sobre cada requisição, incluindo:
 * - Método HTTP
 * - URL solicitada
 * - Status da resposta
 * - Tempo de resposta em milissegundos
 */

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Tempo de resposta: ${responseTime}ms`,
      );
    });

    next();
  }
}
