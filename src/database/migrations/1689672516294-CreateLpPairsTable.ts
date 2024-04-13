import { MigrationInterface, QueryRunner, Table, TableUnique } from "typeorm";

export class CreateLpPairsTable1689672516294 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await queryRunner.createTable(
			new Table({
				name: "lp_pairs",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						generationStrategy: "uuid",
						default: "uuid_generate_v4()",
					},
					{ name: "address", type: "varchar", length: "42" },
					{ name: "token1_address", type: "varchar", length: "42" },
					{ name: "token2_address", type: "varchar", length: "42" },
					{ name: "created_at", type: "timestamp", default: "now()" },
					{ name: "updated_at", type: "timestamp", default: "now()" },
					{ name: "deleted_at", type: "timestamp", isNullable: true },
				],
			}),
			true
		);

		await queryRunner.createUniqueConstraint(
			"lp_pairs",
			new TableUnique({
				name: "UNIQUE_LP_ADDRESS",
				columnNames: ["address"],
			})
		);

		await queryRunner.createUniqueConstraint(
			"lp_pairs",
			new TableUnique({
				name: "UNIQUE_TUPLE_TOKEN_ADDRESSES",
				columnNames: ["token1_address", "token2_address"],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("lp_pairs", true);
	}
}
