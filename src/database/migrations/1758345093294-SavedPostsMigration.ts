import { MigrationInterface, QueryRunner } from "typeorm";

export class SavedPostsMigration1758345093294 implements MigrationInterface {
    name = 'SavedPostsMigration1758345093294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_saved" ("id" SERIAL NOT NULL, "saved_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, "user_id" integer, CONSTRAINT "PK_ff951be466c61908bb086e2d6c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "post_saved" ADD CONSTRAINT "FK_4892b6090666334baa0aa4fef61" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_saved" ADD CONSTRAINT "FK_967edba6b6520fc44c8b44c9494" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_saved" DROP CONSTRAINT "FK_967edba6b6520fc44c8b44c9494"`);
        await queryRunner.query(`ALTER TABLE "post_saved" DROP CONSTRAINT "FK_4892b6090666334baa0aa4fef61"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`DROP TABLE "post_saved"`);
    }

}
