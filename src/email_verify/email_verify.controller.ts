import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailVerifyService } from './email_verify.service';
import { EmailVerifyRequestDto } from './email_verify.dto';
import { ApiResponseData } from 'src/interfaces/api';
import { Throttle } from '@nestjs/throttler';
import { AxiosErrorResponse } from 'src/utils/db-response.dto';

@ApiTags('Email Verification')
@Throttle({ default: { limit: 1, ttl: 500 } })
@Controller('email_verify')
export class EmailVerifyController {
  constructor(private readonly emailVerifyService: EmailVerifyService) {}

  /**
   * Envia um link de verificação para o usuário.
   * @param {EmailVerifyRequestDto} emailVerifyDto - Dados do usuário para gerar o link.
   * @returns {Promise<{ message: string }>}
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar email de verificação',
    operationId: 'verifyUserEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'E-mail enviado com sucesso',
  })
  async sendVerificationEmail(
    @Body() emailVerifyDto: EmailVerifyRequestDto,
  ): Promise<ApiResponseData<null>> {
    return this.emailVerifyService.sendVerificationEmail(emailVerifyDto.email);
  }

  /**
   * Valida o token de verificação.
   * @param {string} token - Token de verificação enviado no e-mail.
   * @returns {Promise<{ message: string }>}
   */
  @Get('confirm')
  @ApiOperation({
    summary: 'Verificar token e ativar e-mail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'E-mail verificado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token inválido ou expirado',
    type: AxiosErrorResponse,
  })
  async confirmEmail(
    @Query('token') token: string,
  ): Promise<ApiResponseData<null>> {
    await this.emailVerifyService.verifyEmailToken(token);
    return { message: 'E-mail verificado com sucesso' };
  }
}
