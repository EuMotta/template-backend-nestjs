import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@Entity({ name: 'audit_log' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  user_id: string;

  @Column()
  @IsNotEmpty({ message: 'O método é obrigatório.' })
  @IsString({ message: 'O método deve ser uma string.' })
  method: string;

  @Column()
  @IsNotEmpty({ message: 'O caminho (path) é obrigatório.' })
  @IsString({ message: 'O caminho (path) deve ser uma string.' })
  path: string;

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  old_data: unknown;

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  new_data: unknown;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
