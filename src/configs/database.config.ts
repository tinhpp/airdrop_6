import { createConnection, Connection } from "typeorm";
import config from "./orm.config";
import * as constants from "./constants";

let connection: Connection;

export const initDBConnection = async () => {
	if (connection) {
		return connection;
	}

	try {
		connection = await createConnection(config);
		if (!connection.isConnected) {
			await connection.connect();
		}

		console.log(
			`Connected to Postgres DB ${constants.DB_DATABASE}@${constants.DB_HOST}:${constants.DB_PORT}`
		);

		return connection;
	} catch (err) {
		console.log(`Error initConnection: ${err}`);
		throw err;
	}
};

export const getDBConnection = () => connection;
