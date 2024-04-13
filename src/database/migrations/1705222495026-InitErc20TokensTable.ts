import { MigrationInterface, QueryRunner } from "typeorm";
import MainnetERC20Tokens from "./mainnet-erc20-tokens.json";
import TestnetERC20Tokens from "./testnet-erc20-tokens.json";

export class InitErc20TokensTable1705222495026 implements MigrationInterface {
    ERC20Tokens: any;

    constructor() {
        this.ERC20Tokens = process.env.NODE_ENV === "production"
            ? MainnetERC20Tokens
            : TestnetERC20Tokens;
    }

	public async up(queryRunner: QueryRunner): Promise<void> {
        for (const { address, name, symbol, decimals, logoURI } of this.ERC20Tokens) {
            await queryRunner.query(
                `INSERT INTO erc20_tokens (address, name, symbol, decimals, logo_uri)
                VALUES ($1, $2, $3, $4, $5)`,
                [address, name, symbol, decimals, logoURI],
            );
        }
    }

	public async down(queryRunner: QueryRunner): Promise<void> {
        const placeholders = this.ERC20Tokens.map((e, i) => '$' + (i + 1)).join(', ');
        await queryRunner.query(
            `DELETE FROM erc20_tokens WHERE address IN (${placeholders})`,
            this.ERC20Tokens.map(e => e.address),
        );
    }
}
