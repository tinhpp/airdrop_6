import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCronjobInfoTable1698187713623 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await queryRunner.createTable(
			new Table({
				name: "cronjob_info",
				columns: [
					{
						name: "id",
						type: "varchar",
						isPrimary: true,
						generationStrategy: "uuid",
						default: "uuid_generate_v4()",
					},
					{ name: "last_block_num", type: "int" },
					{ name: "created_at", type: "timestamp", default: "now()" },
					{ name: "updated_at", type: "timestamp", default: "now()" },
					{ name: "deleted_at", type: "timestamp", isNullable: true },
				],
			}),
			true
		);
    }

	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cronjob_info", true);
    }
}
