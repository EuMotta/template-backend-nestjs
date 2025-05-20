import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Timestamps } from 'src/utils/timestamps.dto';

/**
 * @class UserDto
 *
 * DTO para representar as informações do usuário em respostas.
 * Inclui validações com decorators da biblioteca `class-validator` e documentação para a API com `@ApiProperty` do NestJS Swagger.
 */

export class UserDto extends Timestamps {
  @IsUUID()
  @ApiProperty({
    description: 'ID único de usuário',
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Motta',
  })
  last_name: string;

  @IsString()
  @ApiProperty({
    description: 'primeiro nome do usuário',
    example: 'John',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Imagem do usuário',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  image: string;

  @IsEmail()
  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'user@example.com',
  })
  email: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicador se o usuário está ativo',
    example: true,
    required: false,
  })
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicador se o usuário está com o email verificado',
    example: true,
    required: false,
  })
  is_email_verified: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicador se o usuário foi banido',
    example: false,
    required: false,
  })
  is_banned?: boolean;

  @IsString()
  @ApiProperty({
    description: 'Senha do usuário (hashed)',
    example: '$2b$10$XXXXXXXXXXXXXXXXXXXXX',
  })
  password: string;
}

/**
 * @class CreateUserResponse
 *
 * DTO para a criação de um usuário.
 * Inclui validações com decorators da biblioteca `class-validator` e documentação para a API com `@ApiProperty` do NestJS Swagger.
 */

export class CreateUserResponse {
  @IsString()
  @IsNotEmpty({ message: 'O sobrenome não pode estar vazio' })
  @MaxLength(80, { message: 'O sobrenome pode ter no máximo 80 caracteres' })
  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Silva',
    minLength: 1,
    maxLength: 80,
  })
  last_name: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João',
    minLength: 1,
    maxLength: 30,
  })
  name: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  @MaxLength(256, { message: 'O e-mail pode ter no máximo 256 caracteres' })
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao@email.com',
    format: 'email',
    minLength: 1,
    maxLength: 256,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'minhasenha123',
    minLength: 6,
  })
  password: string;
}

/**
 * @class UpdateUserResponse
 *
 *DTO para atualizar as informações de um usuário.
 * Inclui validações com decorators da biblioteca `class-validator` e documentação para a API com `@ApiProperty` do NestJS Swagger.
 */

export class UpdateUserResponse {
  @IsString()
  @IsOptional()
  @MaxLength(80, { message: 'O sobrenome pode ter no máximo 80 caracteres' })
  @ApiProperty({
    description: 'Editar Sobrenome do usuário',
    example: 'Silva',
    minLength: 1,
    maxLength: 80,
  })
  last_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Editar Nome do usuário',
    example: 'João',
    minLength: 1,
    maxLength: 30,
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Editar Nome do usuário',
    example: 'João',
    minLength: 1,
    maxLength: 30,
  })
  image: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsOptional()
  @MaxLength(256, { message: 'O e-mail pode ter no máximo 256 caracteres' })
  @ApiProperty({
    description: 'Editar E-mail do usuário',
    example: 'joao@email.com',
    format: 'email',
    minLength: 1,
    maxLength: 256,
  })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @ApiProperty({
    description: 'Editar Senha do usuário (mínimo 6 caracteres)',
    example: 'minhasenha123',
    minLength: 6,
  })
  password: string;
}

/**
 * @class UpdateUserStatusResponse
 *
 * DTO para atualizar o status do usuário.
 * Inclui validações com decorators da biblioteca `class-validator` e documentação para a API com `@ApiProperty` do NestJS Swagger.
 */

export class UpdateUserStatusResponse {
  @IsBoolean()
  @ApiProperty({
    description: 'Atualizar status do usuário',
    example: true,
  })
  status: boolean;
}

/**
 * @class UpdateUserEmailResponse
 *
 * DTO para atualizar o e-mail do usuário.
 */

export class UpdateUserEmailResponse {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsOptional()
  @ApiProperty({
    description: 'Email para atualizar o E-mail do usuário',
    example: 'joao@email.com',
    format: 'email',
    minLength: 1,
    maxLength: 256,
  })
  email: string;
}

/**
 * @class UpdateUserPasswordResponse
 *
 * DTO para atualizar a senha do usuário.
 * Inclui validações com decorators da biblioteca `class-validator` e documentação para a API com `@ApiProperty` do NestJS Swagger.
 */

export class UpdateUserPasswordResponse {
  @IsString()
  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'ATX@D341a',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve conter pelo menos 8 caracteres. Sendo uma maiúscula, uma minúscula, um numero e um símbolo',
    },
  )
  new_password: string;
}
