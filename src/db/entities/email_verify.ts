import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'email_verify' })
export class EmailVerifyEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'b4d1f9a8-d3b2-42f1-8c1d-b65ab78b6ed5',
    description: 'ID único gerado automaticamente para a verificação de email',
  })
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
    description: 'ID do usuário associado à verificação de email',
  })
  user: UserEntity;

  @Column({ type: 'text', name: 'token' })
  @ApiProperty({
    example: 'https://example.com/verify?token=abc123',
    description: 'Link para verificação do email',
  })
  token: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  @ApiProperty({
    example: '2025-02-20T15:00:00.000Z',
    description: 'Data e hora em que a solicitação de verificação foi criada',
  })
  created_at: Date;
}
