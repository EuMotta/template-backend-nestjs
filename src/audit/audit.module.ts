import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditLog } from 'src/db/entities/audit.entity';
import { AuditRepository } from './audit.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService, AuditRepository], 
  exports: [AuditService, AuditRepository],
})
export class AuditModule {}
