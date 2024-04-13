import { Address } from "viem";
import { abi as NFTPoolABI } from "../resources/NFTPool.json";
import { publicClient } from "./web3Clients";

export const read = async (
  address: Address,
  functionName: string,
  args: any[]
) => {
  try {
    const result = await publicClient.readContract({
      address,
      abi: NFTPoolABI,
      functionName,
      args,
    });
    return mapResultArrayToObj(functionName, result);
  } catch (err: any) {
    // console.log(err);
    return undefined;
  }
};

const getStakingPositionResultKeys = [
  "amount",
  "amountWithMultiplier",
  "startLockTime",
  "lockDuration",
  "lockMultiplier",
  "rewardDebt",
  "boostPoints",
  "totalMultiplier",
];

const getPoolInfoResultKeys = [
  "lpToken",
  "flashToken",
  "xFlashToken",
  "lastRewardTime",
  "accRewardsPerShare",
  "lpSupply",
  "lpSupplyWithMultiplier",
  "allocPoint",
];

const functionResultKeysMap: { [k: string]: string[] } = {
  getStakingPosition: getStakingPositionResultKeys,
  getPoolInfo: getPoolInfoResultKeys,
};

const mapResultArrayToObj = (functionName: string, result: any) => {
  const props = functionResultKeysMap[functionName];
  if (!props) return result;
  const resObj: { [k: string]: any } = {};
  props.forEach((prop, i) => {
    resObj[prop] = result[i];
  });
  return resObj;
};
