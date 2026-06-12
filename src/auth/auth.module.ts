import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { DEFAULT_JWT_EXPIRATION_SECONDS } from 'src/utils/constants';

/**
 * @module AuthModule
 *
 * Módulo responsável pela autenticação de usuários.
 * Configura o JWT de forma assíncrona, garantindo a obtenção
 * dinâmica do segredo e tempo de expiração a partir do `ConfigService`.
 *
 * Importa o `UsersModule` para permitir validação de credenciais
 * e gerenciamento de usuários autenticados.
 */

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_EXPIRATION_TIME') ?? DEFAULT_JWT_EXPIRATION_SECONDS}s`,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  exports: [AuthService],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
