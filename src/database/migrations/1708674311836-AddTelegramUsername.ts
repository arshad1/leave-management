import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTelegramUsername1708674311836 implements MigrationInterface {
    name = 'AddTelegramUsername1708674311836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "telegramUsername" varchar NULL UNIQUE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "telegramUsername"
        `);
    }
}