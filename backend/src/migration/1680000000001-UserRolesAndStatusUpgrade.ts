import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolesAndStatusUpgrade1680000000001
  implements MigrationInterface
{
  name = 'UserRolesAndStatusUpgrade1680000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        roles JSON NOT NULL DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'Enabled'
      )
    `);

    await queryRunner.query(`
      INSERT INTO users_new (id, username, roles, status)
      SELECT
        id,
        username,
        CASE role
          WHEN 'Admin' THEN json_array('admin')
          WHEN 'Editor' THEN json_array('editor')
          WHEN 'User' THEN json_array('regular')
          ELSE json_array(lower(role))
        END,
        CASE
          WHEN status IS NULL THEN 'Disabled'
          WHEN status = 1 THEN 'Enabled'
          ELSE 'Disabled'
        END
      FROM users
    `);

    await queryRunner.query(`
      UPDATE users_new
      SET roles = json_array('admin', 'editor')
      WHERE username = 'admin_user'
    `);

    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users_old (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'User',
        status INTEGER NULL
      )
    `);

    await queryRunner.query(`
      INSERT INTO users_old (id, username, role, status)
      SELECT
        id,
        username,
        CASE
          WHEN json_extract(roles, '$[0]') IS NULL THEN 'User'
          WHEN json_extract(roles, '$[0]') = 'admin' THEN 'Admin'
          WHEN json_extract(roles, '$[0]') = 'editor' THEN 'Editor'
          WHEN json_extract(roles, '$[0]') = 'regular' THEN 'User'
          ELSE 'User'
        END,
        CASE
          WHEN status = 'Enabled' THEN 1
          ELSE 0
        END
      FROM users
    `);

    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_old RENAME TO users`);
  }
}
