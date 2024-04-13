import { CronjobInfoEntity } from "../entities/cronJobInfo.entity";
import { getRepository } from "typeorm";

const cronjobInfoRepository = () => getRepository(CronjobInfoEntity);

export const getCurrentBlockNum = async () => {
	const cronjobInfo = await cronjobInfoRepository().find();

	if (!cronjobInfo.length) {
		return undefined;
	}

	return cronjobInfo[0].last_block_num;
};

export const updateCurrentBlockNum = async (blockNum: number) => {
	const result = await cronjobInfoRepository()
		.createQueryBuilder()
		.update("cronjob_info")
		.set({ last_block_num: blockNum })
		.where("id IS NOT NULL")
		.execute();

	return result.affected;
};
