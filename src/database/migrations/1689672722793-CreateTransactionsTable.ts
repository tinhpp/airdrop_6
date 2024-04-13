import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableUnique,
} from "typeorm";

export class CreateTransactionsTable1689672722793
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await queryRunner.createTable(
			new Table({
				name: "transactions",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						generationStrategy: "uuid",
						default: "uuid_generate_v4()",
					},
					{ name: "pair_id", type: "varchar" },
					{ name: "tx_hash", type: "varchar", length: "66" },
					{ name: "token1_amount", type: "varchar" },
					{ name: "token2_amount", type: "varchar" },
					{ name: "created_at", type: "timestamp", default: "now()" },
					{ name: "updated_at", type: "timestamp", default: "now()" },
					{ name: "deleted_at", type: "timestamp", isNullable: true },
				],
			}),
			true
		);

		await queryRunner.createUniqueConstraint(
			"transactions",
			new TableUnique({
				name: "UNIQUE_TX_HASH",
				columnNames: ["tx_hash"],
			})
		);

		// create foreign key to lp_pairs
		await queryRunner.createForeignKey(
			"transactions",
			new TableForeignKey({
				columnNames: ["pair_id"],
				referencedTableName: "lp_pairs",
				referencedColumnNames: ["id"],
				onDelete: "CASCADE",
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("transactions", true);
	}
}
