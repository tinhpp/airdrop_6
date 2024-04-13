import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableUnique,
} from "typeorm";

export class CreateNftPoolsTable1698770371101 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await queryRunner.createTable(
			new Table({
				name: "nft_pools",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						generationStrategy: "uuid",
						default: "uuid_generate_v4()",
					},
					{ name: "address", type: "varchar", length: "42" },
					{ name: "pair_id", type: "varchar" },
					{ name: "created_at", type: "timestamp", default: "now()" },
					{ name: "updated_at", type: "timestamp", default: "now()" },
					{ name: "deleted_at", type: "timestamp", isNullable: true },
				],
			}),
			true
		);

		await queryRunner.createUniqueConstraint(
			"nft_pools",
			new TableUnique({
				name: "UNIQUE_NFT_POOL_ADDRESS",
				columnNames: ["address"],
			})
		);

		// create foreign key to lp_pairs
		await queryRunner.createForeignKey(
			"nft_pools",
			new TableForeignKey({
				columnNames: ["pair_id"],
				referencedTableName: "lp_pairs",
				referencedColumnNames: ["id"],
				onDelete: "CASCADE",
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("nft_pools", true);
	}
}
