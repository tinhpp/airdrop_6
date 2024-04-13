import { MigrationInterface, QueryRunner, Table, TableUnique } from "typeorm";

export class CreateErc20TokensTable1705217419275 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await queryRunner.createTable(
			new Table({
				name: "erc20_tokens",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						generationStrategy: "uuid",
						default: "uuid_generate_v4()",
					},
					{ name: "address", type: "varchar", length: "42" },
					{ name: "name", type: "varchar" },
					{ name: "symbol", type: "varchar" },
                    { name: "decimals", type: "int" },
                    { name: "logo_uri", type: "varchar", isNullable: true },
                    { name: "is_official", type: "boolean", default: false },
					{ name: "created_at", type: "timestamp", default: "now()" },
					{ name: "updated_at", type: "timestamp", default: "now()" },
					{ name: "deleted_at", type: "timestamp", isNullable: true },
				],
			}),
			true
		);

        await queryRunner.createUniqueConstraint(
			"erc20_tokens",
			new TableUnique({
				name: "UNIQUE_ERC20_ADDRESS",
				columnNames: ["address"],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("erc20_tokens", true);
    }
}
