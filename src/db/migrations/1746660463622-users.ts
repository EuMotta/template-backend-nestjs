import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1746660463622 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TYPE "user_role" AS ENUM ('ADMIN', 'USER', 'MANAGER');
    
          CREATE TABLE "users" (
              id uuid NOT NULL DEFAULT uuid_generate_v4(),
              name varchar(50) NOT NULL,
              last_name varchar(256) NOT NULL,
              image varchar(256),
              email varchar(256) NOT NULL,
              password varchar(256) NOT NULL,
              is_active boolean NOT NULL DEFAULT true,
              is_banned boolean NOT NULL DEFAULT false,
              is_email_verified boolean NOT NULL DEFAULT false,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP,
              CONSTRAINT user_pk_id PRIMARY KEY (id),
              CONSTRAINT user_un_email UNIQUE (email)
          );
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
      }

}
