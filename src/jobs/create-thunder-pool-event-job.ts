import { JsonRpcProvider, Contract, EventLog } from "ethers";
import * as thunderPoolRepo from "../repositories/thunderPool.repository";
import * as cronjobInfoRepo from "../repositories/cronJobInfo.repository";
import { abi as THUNDER_POOL_FACTORY_ABI } from "../resources/ThunderPoolFactory.json";
import { abi as THUNDER_POOL_ABI } from "../resources/ThunderPool.json";
import { THUNDER_POOL_FACTORY_ADDRESS, RPC_URL } from "../configs/constants";

const provider = new JsonRpcProvider(RPC_URL);

const thunderPoolFactoryContract = new Contract(
	THUNDER_POOL_FACTORY_ADDRESS,
	THUNDER_POOL_FACTORY_ABI,
	provider
);

export const crawlCreateThunderPoolEvents = async () => {
	const lastCrawledBlockNum = (await cronjobInfoRepo.getCurrentBlockNum()) + 1;
	const { number: latestBlockNum } = await provider.getBlock("latest");
	if (lastCrawledBlockNum > latestBlockNum) {
		console.log(
			`crawlCreateThunderPoolEvents: reached head block ${latestBlockNum}`
		);
		return;
	}

	let crawlToBlockNum = lastCrawledBlockNum + 499;
	crawlToBlockNum =
		crawlToBlockNum < latestBlockNum ? crawlToBlockNum : latestBlockNum;

	const eventName = "CreateThunderPool";
	console.log(
		`Listening to event ${eventName} from contract ThunderPoolFactory at ${THUNDER_POOL_FACTORY_ADDRESS} ...`
	);

	let events: EventLog[];
	try {
		events = (await thunderPoolFactoryContract.queryFilter(
			eventName,
			lastCrawledBlockNum,
			crawlToBlockNum
		)) as EventLog[];
	} catch (err: any) {
		console.log(`Error crawlCreateThunderPoolEvents: ${err}`);
		return;
	}

	for (const event of events) {
		try {
			const [thunderPool] = event.args;
			console.log(
				`ThunderPoolFactory contract ${THUNDER_POOL_FACTORY_ADDRESS} - event CreateThunderPool:`,
				{
					thunderPoolAddress: thunderPool,
				},
				`- block: ${event.blockNumber}`
			);

			const thunderPoolContract = new Contract(
				thunderPool,
				THUNDER_POOL_ABI,
				provider
			);

			const nftPoolAddr = await thunderPoolContract.nftPool();

			const thunderPoolEntity = await thunderPoolRepo.createThunderPool(
				thunderPool,
				nftPoolAddr
			);

			if (!thunderPoolEntity) {
				console.log(
					`Error crawlCreateThunderPoolEvents: [DB] Could not save new Thunder pool ${thunderPool}`
				);
				return;
			}

			await cronjobInfoRepo.updateCurrentBlockNum(event.blockNumber);
		} catch (err: any) {
			if (err?.message?.includes("UNIQUE_THUNDER_POOL_ADDRESS")) {
				console.info("crawlCreateThunderPoolEvents:", err.toString());
				continue;
			}
			console.log(`Error crawlCreateThunderPoolEvents: ${err}`);
			return;
		}
	}
	await cronjobInfoRepo.updateCurrentBlockNum(crawlToBlockNum);
};
