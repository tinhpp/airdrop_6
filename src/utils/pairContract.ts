import { abi as FlashpadPairABI } from "../resources/FlashpadPair.json";
import { publicClient } from "./web3Clients";
import { Address } from "viem";

export const read = async (
  address: Address,
  functionName: string,
  args: any[]
) => {
  try {
    const result = await publicClient.readContract({
      address,
      abi: FlashpadPairABI,
      functionName,
      args,
    });
    return result;
  } catch (err: any) {
    console.log(err);
    return undefined;
  }
};
