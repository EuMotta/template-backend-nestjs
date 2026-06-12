import { Injectable } from '@nestjs/common';
import { AuditLog } from 'src/db/entities/audit.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuditRepository extends Repository<AuditLog> {
  constructor(private dataSource: DataSource) {
    super(AuditLog, dataSource.createEntityManager());
  }

  async logAudit({
    user_id,
    method,
    path,
    old_data,
    new_data,
  }: Omit<AuditLog, 'id' | 'created_at'>): Promise<void> {
    const audit = this.create({
      user_id,
      method,
      path,
      old_data,
      new_data,
    });

    await this.save(audit);
  }
}
