import { MigrationInterface, QueryRunner } from "typeorm";
import { DEFAULT_JOBS_START_BLOCK_NUMBER } from "../../configs/constants";

export class InitCronjobInfo1698188389312 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
        const existed = await queryRunner.query(
            "SELECT * FROM cronjob_info",
        );

        if (!existed || existed.length == 0) {
            await queryRunner.query(
                "INSERT INTO cronjob_info (last_block_num) VALUES ($1)",
                [DEFAULT_JOBS_START_BLOCK_NUMBER],
            );
        }
    }

	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "DELETE FROM cronjob_info WHERE id IS NOT NULL",
        );
    }
}
