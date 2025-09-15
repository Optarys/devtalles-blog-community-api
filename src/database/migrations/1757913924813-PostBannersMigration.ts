import { MigrationInterface, QueryRunner } from "typeorm";

export class PostBannersMigration1757913924813 implements MigrationInterface {
    name = 'PostBannersMigration1757913924813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "banner_images" jsonb`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "banner_images"`);
    }

}
