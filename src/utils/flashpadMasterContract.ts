import { Address } from "viem";
import { abi as FlashpadMasterABI } from "../resources/FlashpadMaster.json";
import { publicClient } from "./web3Clients";

export const read = async (
  address: Address,
  functionName: string,
  args: any[]
) => {
  try {
    const result = await publicClient.readContract({
      address,
      abi: FlashpadMasterABI,
      functionName,
      args,
    });
    return mapResultArrayToObj(functionName, result);
  } catch (err: any) {
    console.log(err);
    return undefined;
  }
};

const getPoolInfoResultKeys = [
  "poolAddress",
  "allocPoint",
  "lastRewardTime",
  "reserve",
  "poolEmissionRate",
];

const functionResultKeysMap: { [k: string]: string[] } = {
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
