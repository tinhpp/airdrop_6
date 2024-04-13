import { abi as ThunderPoolFactoryABI } from "../resources/ThunderPoolFactory.json";
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
      abi: ThunderPoolFactoryABI,
      functionName,
      args,
    });
    return result;
  } catch (err: any) {
    console.log(err);
    return undefined;
  }
};
