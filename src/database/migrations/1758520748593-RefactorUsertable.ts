import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorUsertable1758520748593 implements MigrationInterface {
    name = 'RefactorUsertable1758520748593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
    }

}
