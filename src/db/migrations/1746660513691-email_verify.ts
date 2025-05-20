import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailVerify1746660513691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
              CREATE TABLE "email_verify" (
                  id UUID NOT NULL DEFAULT uuid_generate_v4(),
                  user_id UUID NOT NULL,
                  token TEXT NOT NULL,
                  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  CONSTRAINT email_verify_pk_id PRIMARY KEY (id),
                  CONSTRAINT email_verify_fk_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE
              );
            `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "email_verify";`);
      }

}
