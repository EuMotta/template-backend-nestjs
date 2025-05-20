import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class Timestamps {
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
}
