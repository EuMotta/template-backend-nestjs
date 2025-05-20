import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'gpt' })
export class GptEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(2, 50, { message: 'O nome deve ter entre 2 e 50 caracteres.' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'A imagem é obrigatória.' })
  @IsNumber({}, { message: 'A imagem deve ser um número (id ou referência).' })
  image: number;

  @Column()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @IsString({ message: 'A descrição deve ser uma string.' })
  description: string;

  @Column()
  @IsNotEmpty({ message: 'O objetivo é obrigatório.' })
  @IsString({ message: 'O objetivo deve ser uma string.' })
  goal: string;

  @Column('float')
  @IsNotEmpty({ message: 'A temperatura é obrigatória.' })
  @IsNumber({}, { message: 'A temperatura deve ser um número.' })
  temperature: number;

  @Column('text', { array: true })
  @IsArray({ message: 'As capacidades devem ser um array de textos.' })
  @ArrayNotEmpty({ message: 'Informe ao menos uma capacidade.' })
  capabilities: string[];

  @Column('text', { array: true })
  @IsArray({ message: 'As limitações devem ser um array de textos.' })
  @ArrayNotEmpty({ message: 'Informe ao menos uma limitação.' })
  limitations: string[];

  @Column({ type: 'boolean', default: true })
  is_public: boolean;
}
