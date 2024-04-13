import { Request, Response } from "express";
import * as txService from "../services/tx.service";

export const getAllLpsTotalVolume = async (req: Request, res: Response) => {
	const last24h = req.query.last24h === "true";

	try {
		const result = last24h
			? await txService.getLast24hTotalVolumeAllLps()
			: await txService.getAllTimeTotalVolumeAllLps();

		const response: any = {
			data: result,
			message: "ok",
		};

		return res.status(200).json(response);
	} catch (err: any) {
		console.error(`getAllLpsTotalVolume error: ${err?.message || err}`);
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
	}
};

export const getTotalVolumeByLp = async (req: Request, res: Response) => {
	const address = req.query.address as string;
	const last24h = req.query.last24h === "true";

	try {
		const result = await txService.getTotalVolumeByLp(address, last24h);

		const response: any = {
			data: result,
			message: "ok",
		};

		return res.status(200).json(response);
	} catch (err: any) {
		console.error(
			`getTotalVolumeByLp (last24h=${last24h}) error: ${err?.message || err}`
		);
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
	}
};
