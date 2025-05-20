import { ApiProperty } from '@nestjs/swagger';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { IsArray, IsBoolean, IsDate, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class User {
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

  @IsString()
  @ApiProperty({
    description: 'Cargo do usuário',
    example: 'Admin',
  })
  role: string;

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

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Data de criação da conta',
    example: '2024-02-08T12:00:00Z',
    required: false,
  })
  created_at?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Data de alteração da conta',
    example: '2024-02-08T12:30:00Z',
    required: false,
  })
  updated_at?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Data que a conta foi deletada (Desativada)',
    example: null,
    required: false,
  })
  deleted_at?: Date;

  @IsString()
  @ApiProperty({
    description: 'Senha do usuário (hashed)',
    example: '$2b$10$XXXXXXXXXXXXXXXXXXXXX',
  })
  password: string;
}

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */

export class UserPage {
  @IsArray()
  @ApiProperty({ isArray: true, type: User })
  readonly data: User[];

  @ApiProperty({ type: () => PageMeta })
  readonly meta: PageMeta;

  constructor(data: User[], meta: PageMeta) {
    this.data = data;
    this.meta = meta;
  }
}

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */

export class ApiResponseUserList {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Usuário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: UserPage })
  data?: UserPage;
}

/**
 * @class ApiResponseUser
 *
 * DTO para receber no swagger as informações do usuário.
 */

export class ApiResponseUser {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Usuário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: User, nullable: true })
  data?: User| null;
}
