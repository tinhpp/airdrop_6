import { Request, Response } from "express";
import * as lpPairService from "../services/lpPair.service";
import * as nftPoolContract from "../utils/nftPoolContract";
import * as erc20TokenRepository from "../repositories/erc20Token.repository";
import * as pairContract from "../utils/pairContract";
import { formatUnits } from "ethers";
import { RPC_URL, USD_PRICE } from "../configs/constants";
import BigNumber from "bignumber.js";

// useAllNftPoolsData
export const getNftPoolData = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await lpPairService.getAllPairs(page, limit);

    const { total, data: allPairsData } = result;

    const { data: CHAINS_TOKENS_LIST } = await erc20TokenRepository.getAllERC20Tokens();
    const tokenDataMap: Map<string, any> = new Map();
    for (const token of CHAINS_TOKENS_LIST) {
      tokenDataMap.set(token.address, {
        symbol: token.symbol,
        logoURI: token.logo_uri,
        decimals: token.decimals || 18,
      });
    }
    const listPools: any[] = [];
    for (const pairData of allPairsData) {
      const poolAddress = pairData?.nft_pool?.address;
      const poolInfoObj = await nftPoolContract.read(
        poolAddress,
        "getPoolInfo",
        []
      );
      const lpToken = pairData?.address;
      const token1Data = tokenDataMap.get(pairData.token1_address);
      const token2Data = tokenDataMap.get(pairData.token2_address);
      const token1Address = pairData.token1_address;
      const token2Address = pairData.token2_address;

      const token1Logo = token1Data?.logoURI;
      const token2Logo = token2Data?.logoURI;

      const [reserves] = await Promise.all([
        pairContract.read(lpToken, "getReserves", []),
      ]);

      let poolTVL = "0";
      let TVL = "0";
      let lpSupplyAmount = "0";

      if (reserves) {
        const token1Reserve = formatUnits(
          reserves[0],
          token1Data?.decimals || 18
        );
        const token2Reserve = formatUnits(
          reserves[1],
          token2Data?.decimals || 18
        );

        TVL = new BigNumber(token1Reserve)
          .times(USD_PRICE)
          .plus(new BigNumber(token2Reserve).times(USD_PRICE))
          .toFixed(2);
        lpSupplyAmount = formatUnits(poolInfoObj?.lpSupply || 0, 18);
        poolTVL = new BigNumber(lpSupplyAmount)
          .times(new BigNumber(TVL))
          .toFixed(4);
      }

      const vol24h = pairData?.vol24h || 0;

      const feeShare = new BigNumber(vol24h).times(0.3).div(100);
      const feeAPR = feeShare.times(365).div(new BigNumber(TVL)).times(100);

      listPools.push({
        token1: token1Data?.symbol,
        token2: token2Data?.symbol,
        token1Logo,
        token2Logo,
        token1Address,
        token2Address,
        lpTokenAddress: lpToken,
        // lpTokenDecimals: Number(lpTokenDecimals),
        lpTokenDecimals: 18,
        poolAddress,
        poolTVL,
        TVL,
        feeShare,
        feeAPR,
        lpSupplyAmount,
      });
    }

    const poolData = listPools
      .filter((item) => item.lpSupplyAmount !== "0")
      .sort((a, b) => b.lpSupplyAmount - a.lpSupplyAmount);

    return res.status(200).json(poolData);
  } catch (err: any) {
    console.error(`getAllLpPairs error: ${err?.message || err}`);
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};

// const getOneLpPair = async (res: Response, address: string) => {
//   try {
//     const data = await lpPairService.getOnePair(address);

//     const response: any = {
//       message: "ok",
//       data,
//     };

//     return res.status(200).json(response);
//   } catch (err: any) {
//     console.error(`getOneLpPair error: ${err?.message || err}`);
//     return res.status(500).json({
//       message: err?.message || "Internal server error",
//     });
//   }
// };
