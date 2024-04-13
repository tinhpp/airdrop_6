import * as txRepository from "../repositories/tx.repository";
import { Contract, JsonRpcProvider } from "ethers";
import { abi as PAIR_ABI } from "../resources/FlashpadPair.json";
import { RPC_URL } from "../configs/constants";
import { TransactionEntity } from "entities/tx.entity";
import { rGet, rSet } from "../configs/redis";
import BigNumber from "bignumber.js";

const provider = new JsonRpcProvider(RPC_URL);

export const getAllTimeTotalVolumeAllLps = async () => {
	const { data: transactions } = await txRepository.getAllTxs(1, 1000);

	const totalVolumeAllTime = await calculateTotalVolume(transactions);
	return totalVolumeAllTime.toString();
};

export const getLast24hTotalVolumeAllLps = async () => {
	const transactions = await txRepository.getLast24hTxs();

	const totalVolume24hAllLps = await calculateTotalVolume(transactions);
	return totalVolume24hAllLps.toString();
}

export const getTotalVolumeByLp = async (
	lpAddress: string,
	getLast24h: boolean = false
) => {
	const transactions = await txRepository.getTxsByPairAddress(
		lpAddress,
		getLast24h
	);

	const totalVolume24h = await calculateTotalVolume(transactions);
	return totalVolume24h.toString();
};

const calculateTotalVolume = async (transactions: TransactionEntity[]) => {
	let totalVolume = BigNumber(0);
	for (const tx of transactions) {
		const keyToken1Decimals = `decimals:${tx.lp_pair.token1_address}`;
		let token1Decimals, token2Decimals;
		try {
			token1Decimals = await rGet(keyToken1Decimals);
		} catch (error) {
			console.log(`Error calculateTotalVolume: ${error}`);
		}
		if (!token1Decimals) {
			const token1Contract = new Contract(
				tx.lp_pair.token1_address,
				PAIR_ABI,
				provider
			);
			token1Decimals = await token1Contract.decimals();
			rSet(keyToken1Decimals, token1Decimals + "");
		}

		const keyToken2Decimals = `decimals:${tx.lp_pair.token2_address}`;
		try {
			token2Decimals = await rGet(keyToken2Decimals);
		} catch (error) {
			console.log(`Error calculateTotalVolume: ${error}`);
		}
		if (!token2Decimals) {
			const token2Contract = new Contract(
				tx.lp_pair.token2_address,
				PAIR_ABI,
				provider
			);
			token2Decimals = await token2Contract.decimals();
			rSet(keyToken2Decimals, token2Decimals + "");
		}

		const token1ValueUSD = 1;
		const token2ValueUSD = 1;
		totalVolume = totalVolume.plus(
			BigNumber(tx.token1_amount)
				.div(BigNumber(10).pow(token1Decimals))
				.times(token1ValueUSD)
				.plus(
					BigNumber(tx.token2_amount)
						.div(BigNumber(10).pow(token2Decimals))
						.times(token2ValueUSD)
				)
		);
	}
	return totalVolume;
};