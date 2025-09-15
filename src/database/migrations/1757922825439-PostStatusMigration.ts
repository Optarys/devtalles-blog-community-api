import { MigrationInterface, QueryRunner } from "typeorm";

export class PostStatusMigration1757922825439 implements MigrationInterface {
    name = 'PostStatusMigration1757922825439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum" AS ENUM('draft', 'published', 'archived')`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "status" "public"."posts_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "status" character varying(50) NOT NULL DEFAULT 'draft'`);
    }

}
