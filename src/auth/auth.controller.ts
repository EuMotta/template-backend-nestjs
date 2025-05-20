import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto, AuthResponseDto } from './auth.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * @class AuthController
 *
 * Controller responsável pela autenticação dos usuários.
 * Define endpoints relacionados ao login e gerenciamento de autenticação.
 */

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @method signIn
   *
   * Autentica um usuário e retorna os dados e um token de acesso.
   *
   * @param {string} email - Endereço de e-mail do usuário.
   * @param {string} password - Senha do usuário.
   * @returns {Promise<AuthResponseDto>} Retorna um objeto contendo o token de autenticação e informações do usuário.
   *
   * @throws {HttpStatus.UNAUTHORIZED} Se as credenciais forem inválidas.
   *
   *
   */

  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 1000 } })
  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login bem-sucedido',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas',
  })
  @ApiOperation({
    summary: 'Autenticação de usuário',
    operationId: 'authLogin',
  })
  @ApiBody({ type: AuthRequestDto })
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthResponseDto> {
    return this.authService.signIn(email, password);
  }
}
