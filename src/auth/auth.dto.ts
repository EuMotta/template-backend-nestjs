import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * @class AuthRequestDto
 *
 * DTO para a validação do login de um usuário.
 *
 */

export class AuthRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    example: 'mypassword123',
  })
  password: string;
}

/**
 * @class AuthResponseUser
 *
 * DTO para a o retorno dos dados do login de um usuário.
 *
 */

class AuthResponseUser {
  @ApiProperty({
    description: 'User ID',
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
  })
  id: string;
  @ApiProperty({
    description: 'User Email',
    example: 'user@example.com',
  })
  email: string;
  @ApiProperty({
    description: 'User ID',
    example: 'John',
  })
  name: string;
  @ApiProperty({
    description: 'User ID',
    example: 'Motta',
  })
  last_name: string;
}

/**
 * @class AuthResponse
 *
 * DTO que representa a resposta da autenticação, incluindo o token JWT e os dados do usuário autenticado.
 */

class AuthResponse {
  @ApiProperty({
    description: 'JWT token returned after successful authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Details of the authenticated user',
    example: {
      id: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
      email: 'user@example.com',
      last_name: 'Doe',
      name: 'John',
    },
  })
  user: AuthResponseUser;
}

/**
 * @class AuthResponseDto
 *
 * DTO para a resposta completa do login, incluindo status, mensagem e dados.
 */

export class AuthResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful or not',
    example: false,
  })
  error: boolean;

  @ApiProperty({
    description: 'Message associated with the API response',
    example: 'Login realizado com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'The data returned by the API',
    type: AuthResponse,
  })
  data: AuthResponse;
}
