import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({});

import { startCronJobs } from "./jobs";
import { SERVER_PORT } from "./configs/constants";
import { initDBConnection } from "./configs/database.config";

import routes from "./routes";

initDBConnection().then((_) => {
	startCronJobs();
});

const app = express();

app.use(cors());

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});
app.get("/health-check", (req: Request, res: Response) => {
	res.send("OK");
});

/** Routes */
app.use("/lp-pairs", routes.lpPairRoute);
app.use("/total-volume", routes.totalVolumeRoute);
app.use("/thunder-pools", routes.thunderPoolRoute);
app.use("/nft-pools", routes.nftPoolRoute);
app.use("/erc20", routes.erc20TokenRoute);

// Start the express server and listen on the specified port
app.listen(SERVER_PORT, () =>
	console.log(`Server is running on port ${SERVER_PORT}`)
);
