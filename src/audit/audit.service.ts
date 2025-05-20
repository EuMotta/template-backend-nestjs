import { Injectable } from '@nestjs/common';
import { AuditRepository } from './audit.repository';
import { AuditLog } from 'src/db/entities/audit.entity';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async logAudit({
    user_id,
    method,
    path,
    old_data,
    new_data,
  }: Partial<AuditLog>): Promise<void> {
    const auditLog = this.auditRepository.create({
      user_id,
      method,
      path,
      old_data,
      new_data,
    });

    await this.auditRepository.save(auditLog);
  }
}
