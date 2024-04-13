import "dotenv/config";
import { ConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import {
	DB_DATABASE,
	DB_HOST,
	DB_PORT,
	DB_USERNAME,
	DB_PASSWORD,
	DB_MAX_CONNECTION,
} from "./constants";

const config: ConnectionOptions = {
	type: "postgres",
	host: DB_HOST,
	port: DB_PORT,
	username: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_DATABASE,
	entities: ["src/entities/**/*.ts"],
	synchronize: false,
	logging: false,
	extra: {
		connectionLimit: DB_MAX_CONNECTION,
	},
	namingStrategy: new SnakeNamingStrategy(),
	migrations: ["src/database/migrations/**/*.ts"],
	migrationsRun: false,
	cli: {
		migrationsDir: "src/database/migrations",
	},
};

export default config;
