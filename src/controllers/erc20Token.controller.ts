import { Request, Response } from "express";
import * as erc20TokenRepository from "../repositories/erc20Token.repository";
import { instanceToPlain } from "class-transformer";

export const getERC20Tokens = async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 1000;

		const result = await erc20TokenRepository.getAllERC20Tokens(page, limit);

		const { total, data } = result;
		const response: any = {
			data: data.map(e => instanceToPlain(e)),
			message: "ok",
			total,
			page,
			limit,
		};

		return res.status(200).json(response);
	} catch (err: any) {
		console.error("getERC20Tokens error: ", err);
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
	}
};

export const addERC20Token = async (req: Request, res: Response) => {
  try {
    const { address, name, symbol, decimals, logoURI } = req.body;

    if (!address || !name || !symbol || !decimals) {
      return res.status(400).json({
        message: "Invalid ERC20 token metadata provided",
      });
    }

    await erc20TokenRepository.addERC20Token(
      address,
      name,
      symbol,
      decimals,
      logoURI,
    );

    return res.status(201).json({ message: "OK" });
  } catch (err: any) {
    console.error("addERC20Token error: ", err);
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
  }
};
