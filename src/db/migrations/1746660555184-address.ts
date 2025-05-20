import { MigrationInterface, QueryRunner } from "typeorm";

export class Address1746660555184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
              CREATE TABLE "address" (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                user_id uuid NOT NULL,
                street varchar(255) NOT NULL,
                number varchar(10) NOT NULL,
                complement varchar(255),
                district varchar(100) NOT NULL,
                city varchar(100) NOT NULL,
                state varchar(50) NOT NULL,
                zip_code varchar(20) NOT NULL,
                country varchar(50) NOT NULL DEFAULT 'Brasil',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP,
                CONSTRAINT pk_addresses PRIMARY KEY (id),
                CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE
              );
            `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "address";`);
      }

}
