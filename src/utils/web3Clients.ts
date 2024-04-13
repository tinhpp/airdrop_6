import { createPublicClient, createWalletClient, custom, http } from "viem";
import { RPC_URL } from "../configs/constants";
import { lineaTestnet } from "viem/chains";

const publicClient: any = createPublicClient({
  chain: lineaTestnet,
  transport: http(RPC_URL),
});

export { publicClient };
