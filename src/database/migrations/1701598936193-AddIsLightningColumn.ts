import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsLightningColumn1701598936193 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
        const query = `ALTER TABLE thunder_pools ADD COLUMN is_lightning_pool BOOLEAN`;
		await queryRunner.query(query);
    }

	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE thunder_pools DROP COLUMN is_lightning_pool`
        );
    }
}
