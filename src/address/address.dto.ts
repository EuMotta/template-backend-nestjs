import { IsUUID, IsString, IsOptional, IsDate, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @IsUUID()
  @ApiProperty({
    description: 'Identificador único do endereço',
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
  })
  id: string;

  @IsUUID()
  @ApiProperty({
    description: 'Identificador do usuário associado ao endereço',
    example: 'd9b2d63d-a233-4123-847d-56b5c6f85aef',
  })
  user_id: string;

  @IsString()
  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
  })
  street: string;

  @IsString()
  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  number: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Complemento do endereço, se houver',
    example: 'Apto 45',
    required: false,
  })
  complement?: string;

  @IsString()
  @ApiProperty({
    description: 'Bairro ou distrito',
    example: 'Centro',
  })
  district: string;

  @IsString()
  @ApiProperty({
    description: 'Nome da cidade',
    example: 'São Paulo',
  })
  city: string;

  @IsString()
  @ApiProperty({
    description: 'Estado (sigla ou nome completo)',
    example: 'SP',
  })
  state: string;

  @IsString()
  @ApiProperty({
    description: 'CEP (código postal)',
    example: '01001-000',
  })
  zip_code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Nome do país',
    example: 'Brasil',
    required: false,
  })
  country?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-02-08T12:00:00Z',
    required: false,
  })
  created_at?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-02-08T12:30:00Z',
    required: false,
  })
  updated_at?: Date;
}

export class CreateAddressDto {
  @IsNotEmpty({ message: 'O nome da rua é obrigatório.' })
  @IsString({ message: 'O nome da rua deve ser uma string.' })
  street: string;

  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @IsString({ message: 'O número deve ser uma string.' })
  number: string;

  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  complement?: string;

  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @IsString({ message: 'O bairro deve ser uma string.' })
  district: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  city: string;

  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  state: string;

  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  @Length(8, 20, { message: 'O CEP deve ter entre 8 e 20 caracteres.' })
  zip_code: string;

  @IsOptional()
  @IsString({ message: 'O país deve ser uma string.' })
  country?: string;
}
