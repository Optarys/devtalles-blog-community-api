import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfigTableMigration1757969348147 implements MigrationInterface {
    name = 'ConfigTableMigration1757969348147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."configurations_config_type_enum" AS ENUM('general', 'redirections')`);
        await queryRunner.query(`CREATE TABLE "configurations" ("id" SERIAL NOT NULL, "config_type" "public"."configurations_config_type_enum" NOT NULL DEFAULT 'general', "value" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`DROP TABLE "configurations"`);
        await queryRunner.query(`DROP TYPE "public"."configurations_config_type_enum"`);
    }

}
