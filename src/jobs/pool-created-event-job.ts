import { JsonRpcProvider, Contract, EventLog } from "ethers";
import * as nftPoolRepo from "../repositories/nftPool.repository";
import * as cronjobInfoRepo from "../repositories/cronJobInfo.repository";
import { abi as NFT_POOL_FACTORY_ABI } from "../resources/NFTPoolFactory.json";
import { NFT_POOL_FACTORY_ADDRESS, RPC_URL } from "../configs/constants";

const provider = new JsonRpcProvider(RPC_URL);

const nftPoolFactoryContract = new Contract(
	NFT_POOL_FACTORY_ADDRESS,
	NFT_POOL_FACTORY_ABI,
	provider
);

export const crawlPoolCreatedEvents = async () => {
	const lastCrawledBlockNum = (await cronjobInfoRepo.getCurrentBlockNum()) + 1;
	const { number: latestBlockNum } = await provider.getBlock("latest");
	if (lastCrawledBlockNum > latestBlockNum) {
		console.log(`crawlPoolCreatedEvents: reached head block ${latestBlockNum}`);
		return;
	}

	let crawlToBlockNum = lastCrawledBlockNum + 499;
	crawlToBlockNum =
		crawlToBlockNum < latestBlockNum ? crawlToBlockNum : latestBlockNum;

	const eventName = "PoolCreated";
	console.log(
		`Listening to event ${eventName} from contract NftPoolFactory at ${NFT_POOL_FACTORY_ADDRESS} ...`
	);

	let events: EventLog[];
	try {
		events = (await nftPoolFactoryContract.queryFilter(
			eventName,
			lastCrawledBlockNum,
			crawlToBlockNum
		)) as EventLog[];
	} catch (err: any) {
		console.log(`Error crawlPoolCreatedEvents: ${err}`);
		return;
	}

	for (const event of events) {
		try {
			const [lpToken, pool] = event.args;
			console.log(
				`NftPoolFactory contract ${NFT_POOL_FACTORY_ADDRESS} - event PoolCreated:`,
				{
					lpAddress: lpToken,
					nftPoolAddress: pool,
				},
				`- block: ${event.blockNumber}`
			);

			const nftPoolEntity = await nftPoolRepo.createNftPool(
				lpToken,
        pool,
			);

			if (!nftPoolEntity) {
				console.log(
					`Error crawlPoolCreatedEvents: [DB] Could not save new NFT pool ${pool}`
				);
				return;
			}

			await cronjobInfoRepo.updateCurrentBlockNum(event.blockNumber);
		} catch (err: any) {
			if (err?.message?.includes("UNIQUE_NFT_POOL_ADDRESS")) {
				console.info("crawlPoolCreatedEvents:", err.toString());
				continue;
			}
			console.log(`Error crawlPoolCreatedEvents: ${err}`);
			return;
		}
	}
	await cronjobInfoRepo.updateCurrentBlockNum(crawlToBlockNum);
};
