import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './auth.dto';
import { UserAuthDto } from 'src/users/user.dto';
import { DEFAULT_JWT_EXPIRATION_SECONDS } from 'src/utils/constants';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';

/**
 * @service AuthService
 *
 * Serviço responsável pela autenticação dos usuários.
 *
 * Este serviço gerencia o processo de login e geração de tokens JWT para autenticação segura.
 */
@Injectable()
export class AuthService {
  /**
   * @property {number} jwtExpirationTimeInSeconds
   * @description Tempo de expiração do token JWT em segundos, definido no arquivo de configuração.
   */
  private jwtExpirationTimeInSeconds: number;

  /**
   * @constructor
   * @param {UsersService} usersService - Serviço de usuários para buscar informações de autenticação.
   * @param {JwtService} jwtService - Serviço do NestJS para manipulação de tokens JWT.
   * @param {ConfigService} configService - Serviço de configuração para acessar variáveis de ambiente.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +(
      this.configService.get<number>('JWT_EXPIRATION_TIME') ??
      DEFAULT_JWT_EXPIRATION_SECONDS
    );
  }

  /**
   * @method signIn
   * @description Autentica um usuário com base no e-mail e senha fornecidos.
   *
   * @param {string} email - O e-mail do usuário.
   * @param {string} password - A senha do usuário.
   * @returns {Promise<AuthResponseDto>} Retorna um objeto contendo o token JWT, tempo de expiração e informações do usuário.
   *
   * @throws {NotFoundException} Caso o usuário não seja encontrado.
   * @throws {UnauthorizedException} Caso as credenciais sejam inválidas ou a conta esteja desativada/banida.
   * @throws {InternalServerErrorException} Em caso de erro inesperado.
   */

  async signIn(email: string, password: string): Promise<AuthResponseDto> {
    try {
      if (!isEmail(email)) {
        throw new BadRequestException('Formato de e-mail inválido');
      }

      const findUser = await this.usersService.findByUserEmailAuth(email);

      if (!findUser) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      const foundUser = findUser.data as UserAuthDto;

      if (!foundUser) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      if (!foundUser.is_active || foundUser.is_banned) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      if (!bcryptCompareSync(password, foundUser.password)) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const payload = {
        sub: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      };

      const token = this.jwtService.sign(payload);

      const user = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        last_name: foundUser.last_name,
      };

      return {
        error: false,
        message: 'Login realizado com sucesso',
        data: {
          token,
          expiresIn: this.jwtExpirationTimeInSeconds,
          user,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar fazer login.',
      );
    }
  }
}
