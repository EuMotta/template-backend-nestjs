import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditTable1739578867336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "audit_log" (
          id UUID NOT NULL DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          method VARCHAR(10) NOT NULL,
          path TEXT NOT NULL,
          old_data JSONB,
          new_data JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT audit_log_pk_id PRIMARY KEY (id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_log";`);
  }
}
