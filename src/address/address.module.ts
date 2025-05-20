import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressEntity } from 'src/db/entities/address.entity';
import { UserEntity } from 'src/db/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AddressController],
  imports: [
    TypeOrmModule.forFeature([AddressEntity, UserEntity]),
    UsersModule,
  ],
  exports: [AddressService],
  providers: [AddressService],
})
export class AddressModule {}
