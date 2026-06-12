import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1746660463622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '256',
            isNullable: false,
          },
          {
            name: 'image',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '256',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '256',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: 'true',
            isNullable: false,
          },
          {
            name: 'is_banned',
            type: 'boolean',
            default: 'false',
            isNullable: false,
          },
          {
            name: 'is_email_verified',
            type: 'boolean',
            default: 'false',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
            default: "'USER'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
