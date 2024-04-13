import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableUnique,
} from "typeorm";

export class CreateThunderPoolsTable1698774363426 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await queryRunner.createTable(
			new Table({
				name: "thunder_pools",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						generationStrategy: "uuid",
						default: "uuid_generate_v4()",
					},
					{ name: "address", type: "varchar", length: "42" },
					{ name: "nft_pool_id", type: "varchar" },
					{ name: "created_at", type: "timestamp", default: "now()" },
					{ name: "updated_at", type: "timestamp", default: "now()" },
					{ name: "deleted_at", type: "timestamp", isNullable: true },
				],
			}),
			true
		);

		await queryRunner.createUniqueConstraint(
			"thunder_pools",
			new TableUnique({
				name: "UNIQUE_THUNDER_POOL_ADDRESS",
				columnNames: ["address"],
			})
		);

		// create foreign key to nft_pools
		await queryRunner.createForeignKey(
			"thunder_pools",
			new TableForeignKey({
				columnNames: ["nft_pool_id"],
				referencedTableName: "nft_pools",
				referencedColumnNames: ["id"],
				onDelete: "CASCADE",
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("thunder_pools", true);
	}
}
