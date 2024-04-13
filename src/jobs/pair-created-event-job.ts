import { JsonRpcProvider, Contract, EventLog } from "ethers";
import { createSwapEventCronJob } from "./swap-event-jobs";
import * as lpPairRepo from "../repositories/lpPair.repository";
import * as nftPoolRepo from "../repositories/nftPool.repository";
import * as cronjobInfoRepo from "../repositories/cronJobInfo.repository";
import { abi as PAIR_FACTORY_ABI } from "../resources/FlashpadFactory.json";
import { PAIR_FACTORY_ADDRESS, RPC_URL } from "../configs/constants";

const provider = new JsonRpcProvider(RPC_URL);

const pairFactoryContract = new Contract(
	PAIR_FACTORY_ADDRESS,
	PAIR_FACTORY_ABI,
	provider
);

export const crawlPairCreatedEvents = async () => {
	const lastCrawledBlockNum = (await cronjobInfoRepo.getCurrentBlockNum()) + 1;
	const { number: latestBlockNum } = await provider.getBlock("latest");
	if (lastCrawledBlockNum > latestBlockNum) {
		console.log(`crawlPairCreatedEvents: reached head block ${latestBlockNum}`);
		return;
	}

	let crawlToBlockNum = lastCrawledBlockNum + 499;
	crawlToBlockNum =
		crawlToBlockNum < latestBlockNum ? crawlToBlockNum : latestBlockNum;

	const eventName = "PairCreated";
	console.log(
		`Listening to event ${eventName} from contract Pair Factory at ${PAIR_FACTORY_ADDRESS} ...`
	);

	let events: EventLog[];
	try {
		events = (await pairFactoryContract.queryFilter(
			eventName,
			lastCrawledBlockNum,
			crawlToBlockNum
		)) as EventLog[];
	} catch (err: any) {
		console.log(`Error crawlPairCreatedEvents: ${err}`);
		return;
	}

	for (const event of events) {
		try {
			const [token0, token1, pair, length] = event.args;
			console.log(
				`PairFactory contract ${PAIR_FACTORY_ADDRESS} - event PairCreated:`,
				{
					token0,
					token1,
					pair,
					length,
				},
				`- block: ${event.blockNumber}`
			);

			const lpPairEntity = await lpPairRepo.createPair(
				pair + "",
				token0 + "",
				token1 + ""
			);

			if (!lpPairEntity) {
				console.log(
					`Error crawlPairCreatedEvents: [DB] Could not save new LP pair ${pair}`
				);
				return;
			}

			await nftPoolRepo.updateNftPool(pair + "", lpPairEntity.id);

			await cronjobInfoRepo.updateCurrentBlockNum(event.blockNumber);
			createSwapEventCronJob("*/15 * * * * *", pair + "");
		} catch (err: any) {
			if (err?.message?.includes("UNIQUE_LP_ADDRESS")) {
				console.info("crawlPairCreatedEvents:", err.toString());
				continue;
			}
			console.log(`Error crawlPairCreatedEvents: ${err}`);
			return;
		}
	}
	await cronjobInfoRepo.updateCurrentBlockNum(crawlToBlockNum);
};
