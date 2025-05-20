import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptions {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Transform(({ value }) => Number(value) || 1)
  @IsInt()
  @Min(1)
  readonly page: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  @Transform(({ value }) => Number(value) || 10)
  @IsInt()
  @Min(1)
  @Max(50)
  readonly limit: number;

  @ApiPropertyOptional({ description: 'Termo de busca para pesquisa' })
  @IsString()
  @IsOptional()
  readonly search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por status' })
  @IsOptional()
  readonly status?: string;

  @ApiPropertyOptional({ description: 'Nome do campo para ordenação' })
  @IsString()
  @IsOptional()
  readonly orderBy?: string = 'created_at';

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
