import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * @class EmailVerifyDto
 *
 * DTO para representar as informações da verificação de email.
 *
 */

export class EmailVerifyDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID do item',
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
  })
  id: string;
  
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token de verificação gerado para o usuário',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @IsDate()
  @ApiProperty({
    description: 'Hora de criação do token',
    example: '2024-02-08T12:00:00Z',
    required: false,
  })
  created_at?: Date;
}

/**
 * @class EmailVerifyResponseDto
 *
 * DTO para representar as informações da verificação de email.
 *
 */

export class EmailVerifyRequestDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;
}
export class EmailVerifyRequest {
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;
}
