import { Address } from "viem";
import { abi as ThunderPoolABI } from "../resources/ThunderPool.json";
import { publicClient } from "./web3Clients";

export const read = async (
  address: Address,
  functionName: string,
  args: any[]
) => {
  try {
    const result = await publicClient.readContract({
      address,
      abi: ThunderPoolABI,
      functionName,
      args,
    });
    return mapResultArrayToObj(functionName, result);
  } catch (err: any) {
    console.log(err);
    return undefined;
  }
};

const rewardsTokenResultKeys = [
  "token",
  "amount",
  "remainingAmount",
  "accRewardsPerShare",
];

const pendingRewardsResultKeys = ["pending1", "pending2"];

const settingsResultKeys = [
  "startTime",
  "endTime",
  "harvestStartTime",
  "depositEndTime",
  "lockDurationReq",
  "lockEndReq",
  "depositAmountReq",
  "whitelist",
  "description",
];

const userInfoResultKeys = [
  "totalDepositAmount",
  "rewardDebtToken1",
  "rewardDebtToken2",
  "pendingRewardsToken1",
  "pendingRewardsToken2",
];

const functionResultKeysMap: { [k: string]: string[] } = {
  rewardsToken1: rewardsTokenResultKeys,
  rewardsToken2: rewardsTokenResultKeys,
  pendingRewards: pendingRewardsResultKeys,
  settings: settingsResultKeys,
  userInfo: userInfoResultKeys,
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
