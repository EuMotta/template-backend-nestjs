import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AuditTable1739578867336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_log',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'method',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'path',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'old_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'new_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_log');
  }
}
