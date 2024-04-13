import { MigrationInterface, QueryRunner, TableUnique } from "typeorm";

export class AddLpTokenToNftPoolsTable1698807450286
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE nft_pools ALTER COLUMN pair_id DROP NOT NULL`
		);

		const query = `ALTER TABLE nft_pools ADD COLUMN lp_address VARCHAR(42)`;
		await queryRunner.query(query);

		await queryRunner.createUniqueConstraint(
			"nft_pools",
			new TableUnique({
				name: "UNIQUE_LP_TOKEN_ADDRESS",
				columnNames: ["lp_address"],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const query = `ALTER TABLE nft_pools DROP COLUMN lp_address`;
		await queryRunner.query(query);

		await queryRunner.query(
			`ALTER TABLE nft_pools ALTER COLUMN pair_id SET NOT NULL`
		);
	}
}
