import { toObject } from "../utils/misc";
import { Contract, JsonRpcProvider, ZeroAddress, ethers } from "ethers";
import { Request, Response } from "express";
import * as thunderPoolRepository from "../repositories/thunderPool.repository";
import * as erc20TokenRepository from "../repositories/erc20Token.repository";
import { Address } from "viem";
import {
	THUNDER_POOL_FACTORY_ADDRESS,
	ONE_YEAR,
	RPC_URL,
	ADDRESS_ZERO,
} from "../configs/constants";
import { abi as FlashpadPairABI } from "../resources/FlashpadPair.json";
import { abi as THUNDER_POOL_ABI } from "../resources/ThunderPool.json";
import * as thunderPoolService from "../services/thunderPool.service";
import * as thunderPoolContract from "../utils/thunderPoolContract";
import * as thunderPoolFactoryContract from "../utils/thunderPoolFactoryContract";
import * as nftPoolContract from "../utils/nftPoolContract";
import * as pairContract from "../utils/pairContract";
import * as erc20Contract from "../utils/erc20TokenContract";

export const getInfo = async (req: Request, res: Response) => {
	try {
		const { address } = req.params;
		if (!ethers.isAddress(address)) {
			return res.status(400).json({
				message: "Thunder pool address is not valid!",
			});
		}

		const thunderPool = await thunderPoolService.getThunderPoolByAddress(
			address
		);
		console.log({ thunderPool });
		if (!thunderPool) {
			return res.status(404).json({
				message: "Thunder pool not existed!",
			});
		}

		const provider = new JsonRpcProvider(RPC_URL);
		const thunderPoolContract = new Contract(
			address,
			THUNDER_POOL_ABI,
			provider
		);

		const pairContract = new Contract(
			thunderPool.nft_pool.lp_address,
			FlashpadPairABI,
			provider
		);

		const [
			[reserves0, reserves1],
			lpTotalSupply,
			totalDepositAmount,
			rewardsToken1PerSecond,
		] = await Promise.all([
			pairContract.getReserves(),
			pairContract.totalSupply(),
			thunderPoolContract.totalDepositAmount(),
			thunderPoolContract.rewardsToken1PerSecond(),
		]);

		// !TODO: Call api or do something to calculate price
		const reserveToken1Price = BigInt(1);
		const reserveToken2Price = BigInt(1);
		const lpTVL =
			reserves0 * reserveToken1Price + reserves1 * reserveToken2Price;

		// 1 parameter
		const thunderPoolTVP = (totalDepositAmount * lpTVL) / lpTotalSupply;

		// !TODO: Call api or do something to calculate price
		const rewardsToken1Price = BigInt(1);
		const yearlyEmission =
			rewardsToken1PerSecond * rewardsToken1Price * BigInt(ONE_YEAR);

		/**
		 * APR = (yearly emission / TVL ThunderPool) * 100
		 */
		const apr =
			thunderPoolTVP === BigInt(0)
				? BigInt(0)
				: (yearlyEmission * BigInt(100)) / thunderPoolTVP;

		const response: any = {
			message: "ok",
			data: {
				thunderPoolTVP: thunderPoolTVP.toString(),
				apr: apr.toString(),
				lpTotalSupply: lpTotalSupply.toString(),
				totalDepositAmount: totalDepositAmount.toString(),
			},
		};

		return res.status(200).json(response);
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
	}
};

// useAllThunderPoolsData
export const getAllThunderPoolsData = async (req: Request, res: Response) => {
	if (req.query.offChain === "true") {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const result = await thunderPoolRepository.getAllThunderPools(page, limit);
		return res.status(200).json(result);
	}
	try {
		const { userAddress = ZeroAddress } = req.query;
		const listThunderPools = [];

		const nPools = await thunderPoolFactoryContract.read(
			THUNDER_POOL_FACTORY_ADDRESS as Address,
			"thunderPoolsLength",
			[]
		);

		for (let i = 0; i < nPools; i++) {
			const thunderPoolAddress = await thunderPoolFactoryContract.read(
				THUNDER_POOL_FACTORY_ADDRESS as Address,
				"getThunderPool",
				[i]
			);

			const isPublished = await thunderPoolContract.read(
				thunderPoolAddress as Address,
				"published",
				[]
			);

			if (!isPublished) {
				continue;
			}

			const [
				rewardsToken1,
				rewardsToken2,
				settings,
				totalDepositAmount,
				pendingRewards,
				nftPoolAddress,
			] = await Promise.all([
				thunderPoolContract.read(thunderPoolAddress, "rewardsToken1", []),
				thunderPoolContract.read(thunderPoolAddress, "rewardsToken2", []),
				thunderPoolContract.read(thunderPoolAddress, "settings", []),
				thunderPoolContract.read(thunderPoolAddress, "totalDepositAmount", []),
				thunderPoolContract.read(thunderPoolAddress, "pendingRewards", [
					userAddress,
				]),
				thunderPoolContract.read(thunderPoolAddress, "nftPool", []),
			]);

			const [rewardsToken1Symbol, poolInfoObj] = await Promise.all([
				erc20Contract.erc20Read(rewardsToken1?.token, "symbol", []),
				nftPoolContract.read(nftPoolAddress, "getPoolInfo", []),
			]);

			let rewardsToken2Symbol = "";
			if (
				rewardsToken2 &&
				rewardsToken2.token &&
				rewardsToken2.token !== ADDRESS_ZERO
			) {
				rewardsToken2Symbol = await erc20Contract.erc20Read(
					rewardsToken2?.token,
					"symbol",
					[]
				);
			}

			const { data: CHAINS_TOKENS_LIST } = await erc20TokenRepository.getAllERC20Tokens();

			const rewardsToken1Logo = CHAINS_TOKENS_LIST.find((e) => {
				return e.symbol == rewardsToken1Symbol;
			})?.logo_uri;

			const rewardsToken2Logo = CHAINS_TOKENS_LIST.find((e) => {
				return e.symbol == rewardsToken2Symbol;
			})?.logo_uri;

			const lpToken = poolInfoObj?.lpToken;

			let [lpTokenDecimals, token1Address, token2Address] = await Promise.all([
				pairContract.read(lpToken, "decimals", []),
				pairContract.read(lpToken, "token0", []),
				pairContract.read(lpToken, "token1", []),
			]);

			let token1Symbol = "TOKEN1",
				token2Symbol = "TOKEN2";
			if (token1Address) {
				[token1Symbol, token2Symbol] = await Promise.all([
					erc20Contract.erc20Read(token1Address, "symbol", []),
					erc20Contract.erc20Read(token2Address, "symbol", []),
				]);
			} else if (lpTokenDecimals) {
				token1Symbol = await erc20Contract.erc20Read(lpToken, "symbol", []);
				token2Symbol = token1Symbol;
			}

			token1Symbol =
				token1Symbol == "WFTM" || token1Symbol == "WETH" ? "ETH" : token1Symbol;
			token2Symbol =
				token2Symbol == "WFTM" || token2Symbol == "WETH" ? "ETH" : token2Symbol;

			const token1Logo = CHAINS_TOKENS_LIST.find((e) => {
				return e.symbol === token1Symbol;
			})?.logo_uri;

			const token2Logo = CHAINS_TOKENS_LIST.find((e) => {
				return e.symbol === token2Symbol;
			})?.logo_uri;

			listThunderPools.push({
				token1: token1Symbol,
				token2: token2Symbol,
				token1Logo,
				token2Logo,
				token1Address,
				token2Address,
				rewardsToken1Info: rewardsToken1,
				rewardsToken2Info: rewardsToken2,
				rewardsToken1Symbol,
				rewardsToken2Symbol,
				rewardsToken1Logo,
				rewardsToken2Logo,
				settings,
				totalDeposit: totalDepositAmount,
				pendingRewards,
				lpTokenAddress: lpToken,
				lpTokenDecimals: Number(lpTokenDecimals),
				nftPoolAddress,
				poolAddress: thunderPoolAddress,
			});
		}

		return res.json(toObject(listThunderPools));
	} catch (err: any) {
		return res.status(500).json({
			message: err?.message || "Internal server error",
		});
	}
};
