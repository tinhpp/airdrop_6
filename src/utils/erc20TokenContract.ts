import { abi as ERC20ABI } from "../resources/ERC20.json";
import { publicClient } from "./web3Clients";
import { Address } from "viem";

export const erc20Read = async (
  address: Address,
  functionName: string,
  args: any[]
) => {
  try {
    const result = await publicClient.readContract({
      address,
      abi: ERC20ABI,
      functionName,
      args,
    });
    return result;
  } catch (err: any) {
    console.log(err);
    return undefined;
  }
};
