import cron from "node-cron";
import { JsonRpcProvider, Contract, EventLog } from "ethers";
import { abi as PAIR_ABI } from "../resources/FlashpadPair.json";
import { RPC_URL } from "../configs/constants";
import * as lpPairRepo from "../repositories/lpPair.repository";
import * as txRepo from "../repositories/tx.repository";
import * as cronjobInfoRepo from "../repositories/cronJobInfo.repository";

// Define a Map to store your cronjob objects
const cronJobs: { [k: string]: cron.ScheduledTask } = {};

export const getCronJobs = () => cronJobs;

const provider = new JsonRpcProvider(RPC_URL);

const crawlSwapEvents = async (pairAddress: string) => {
	const lastCrawledBlockNum = (await cronjobInfoRepo.getCurrentBlockNum()) + 1;
	const { number: latestBlockNum } = await provider.getBlock("latest");
	if (lastCrawledBlockNum > latestBlockNum) {
		console.log(`crawlSwapEvents: reached head block ${latestBlockNum}`);
		return;
	}

	let crawlToBlockNum = lastCrawledBlockNum + 499;
	crawlToBlockNum =
		crawlToBlockNum < latestBlockNum ? crawlToBlockNum : latestBlockNum;

	const pairContract = new Contract(pairAddress, PAIR_ABI, provider);

	const eventName = "Swap";
	console.log(
		`Listening to event ${eventName} from contract Pair at ${pairAddress} ...`
	);

	let events: EventLog[];
	try {
		events = (await pairContract.queryFilter(
			eventName,
			lastCrawledBlockNum,
			crawlToBlockNum
		)) as EventLog[];
	} catch (err: any) {
		console.log(`Error crawlSwapEvents: ${err}`);
	}

	for (const event of events) {
		try {
			const [sender, amount0In, amount1In, amount0Out, amount1Out, to] =
				event.args;
			console.log(
				`Pair contract ${pairAddress} - event Swap:`,
				{
					sender,
					amount0In,
					amount1In,
					amount0Out,
					amount1Out,
					to,
				},
				`- block: ${event.blockNumber}`
			);

			const lpPair = await lpPairRepo.getPairByAddress(pairAddress);
			if (!lpPair) {
				console.log(
					`Error crawlSwapEvents: [DB] could not find lpPair by address ${pairAddress}`
				);
				continue;
			}

			const newTx = await txRepo.createTx(
				lpPair.id,
				event.transactionHash,
				amount0In,
				amount1In
			);

			if (!newTx) {
				console.log("Error: [DB] Could not save new Swap tx", {
					amount0In,
					amount1In,
					to,
					txHash: event.transactionHash,
				});
				return;
			}
			await cronjobInfoRepo.updateCurrentBlockNum(event.blockNumber);
		} catch (err: any) {
			if (err?.message?.includes("UNIQUE_TX_HASH")) {
				console.info("crawlSwapEvents:", err.toString());
				continue;
			}
			console.log(`Error crawlSwapEvents: ${err}`);
			return;
		}
	}
	await cronjobInfoRepo.updateCurrentBlockNum(crawlToBlockNum);
};

// Function to create and manage a new cron job
export const createSwapEventCronJob = (
	schedule: string,
	pairAddress: string
) => {
	const job = cron.schedule(schedule, () => {
		// Perform the task here
		crawlSwapEvents(pairAddress);
	});

	// Store the job object in the Map for future reference
	cronJobs[pairAddress] = job;

	// Start the cron job
	job.start();
};
