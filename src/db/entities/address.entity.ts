import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'address' })
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'O nome da rua é obrigatório.' })
  @IsString({ message: 'O nome da rua deve ser uma string.' })
  street: string;

  @Column({ type: 'varchar', length: 10 })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @IsString({ message: 'O número deve ser uma string.' })
  number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  complement?: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @IsString({ message: 'O bairro deve ser uma string.' })
  district: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  state: string;

  @Column({ type: 'varchar', length: 20 })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  @Length(8, 20, { message: 'O CEP deve ter entre 8 e 20 caracteres.' })
  zip_code: string;

  @Column({ type: 'varchar', length: 50, default: 'Brasil' })
  @IsOptional()
  @IsString({ message: 'O país deve ser uma string.' })
  country?: string;
}
