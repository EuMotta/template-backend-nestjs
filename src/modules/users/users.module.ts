import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserEntity]), AuditModule],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
