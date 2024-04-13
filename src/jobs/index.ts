import cron from "node-cron";
import * as lpPairRepo from "../repositories/lpPair.repository";
import { crawlPairCreatedEvents } from "./pair-created-event-job";
import { crawlPoolCreatedEvents } from "./pool-created-event-job";
import { createSwapEventCronJob } from "./swap-event-jobs";
import { crawlCreateThunderPoolEvents } from "./create-thunder-pool-event-job";
import {
	CREATE_THUNDER_POOL_EVENT_JOB_ENABLED,
	PAIR_CREATED_EVENT_JOB_ENABLED,
	POOL_CREATED_EVENT_JOB_ENABLED,
	SWAP_EVENT_JOB_ENABLED,
} from "../configs/constants";

export const startCronJobs = async () => {
	try {
		if (PAIR_CREATED_EVENT_JOB_ENABLED) {
			cron.schedule("*/15 * * * * *", crawlPairCreatedEvents).start();
		}

		if (POOL_CREATED_EVENT_JOB_ENABLED) {
			cron.schedule("*/15 * * * * *", crawlPoolCreatedEvents).start();
		}

		if (CREATE_THUNDER_POOL_EVENT_JOB_ENABLED) {
			cron.schedule("*/15 * * * * *", crawlCreateThunderPoolEvents).start();
		}

		if (SWAP_EVENT_JOB_ENABLED) {
			const { data: lpPairs } = await lpPairRepo.getAllPairs(1, 1000);
			const listPairAddresses = lpPairs.map((p) => p.address);

			for (const addr of listPairAddresses) {
				createSwapEventCronJob("*/15 * * * * *", addr + "");
			}
		}
	} catch (error) {
		console.log("Error startCronJobs:", error);
	}
};
