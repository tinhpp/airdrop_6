import { GetBalanceParameters, GetBlockParameters } from "viem";
import { publicClient } from "./web3Clients";
import { format, fromUnixTime } from "date-fns";
import BigNumber from "bignumber.js";

export const getBlock = async (params?: GetBlockParameters) => {
	return await publicClient.getBlock(params);
};

export const getBalance = async (params?: GetBalanceParameters) => {
	return await publicClient.getBalance(params);
};

/**
 * BigNumber version of the UniswapV2Library function `quote`
 * @param amountA
 * @param reserveA
 * @param reserveB
 * @returns amountB
 */
export const bnQuote = (
	amountA: BigNumber,
	reserveA: BigNumber,
	reserveB: BigNumber
) => {
	return amountA.times(reserveB).div(reserveA);
};

export const nthPowerOf10 = (n: number) => {
	return BigInt("1".padEnd(n + 1, "0"));
};

export const getDateFormat = (value: any) => {
	if (value) {
		const timestampBigInt = BigInt(value.toString());
		const timestampInSeconds = Number(timestampBigInt);
		const date = fromUnixTime(timestampInSeconds);
		return format(date, "dd/MM/yyyy");
	}
	return "";
};
