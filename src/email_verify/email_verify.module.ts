import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerifyEntity } from 'src/db/entities/email_verify';
import { UserEntity } from 'src/db/entities/user.entity';
import { EmailVerifyService } from './email_verify.service';
import { EmailVerifyController } from './email_verify.controller';

@Module({
  controllers: [EmailVerifyController],
  imports: [TypeOrmModule.forFeature([EmailVerifyEntity, UserEntity])],
  providers: [EmailVerifyService],
  exports: [EmailVerifyService],
})
export class EmailVerifyModule {}
