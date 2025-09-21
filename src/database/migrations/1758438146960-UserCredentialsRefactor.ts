import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCredentialsRefactor1758438146960 implements MigrationInterface {
    name = 'UserCredentialsRefactor1758438146960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_credentials" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."user_credentials_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user_credentials" DROP COLUMN "identifier"`);
        await queryRunner.query(`ALTER TABLE "user_credentials" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_credentials" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_credentials" ADD "identifier" character varying(255) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."user_credentials_type_enum" AS ENUM('email_password', 'username_password')`);
        await queryRunner.query(`ALTER TABLE "user_credentials" ADD "type" "public"."user_credentials_type_enum" NOT NULL`);
    }

}
