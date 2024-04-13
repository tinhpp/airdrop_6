import { LpPairEntity } from "../entities/lpPair.entity";
import { In, getRepository } from "typeorm";

const lpPairRepository = () => getRepository(LpPairEntity);

export const getAllPairs = async (page: number, limit: number) => {
	const queryBuilder = lpPairRepository()
		.createQueryBuilder("lp_pairs")
		.leftJoinAndSelect("lp_pairs.nft_pool", "nft_pools")
    .skip((page - 1) * limit)
    .take(limit);

	const [data, total] = await queryBuilder.getManyAndCount();

	return { total, data };
};

export const getPairByAddress = async (address: string) => {
	const queryBuilder = lpPairRepository()
		.createQueryBuilder("lp_pairs")
		.leftJoinAndSelect("lp_pairs.nft_pool", "nft_pools")
		.where("LOWER(lp_pairs.address) = LOWER(:address)", { address });

	const lpPair = await queryBuilder.getOne();
	return lpPair;
};

export const createPair = async (
	pairAddress: string,
	token1Address: string,
	token2Address: string
) => {
	const lpPairObj: Partial<LpPairEntity> = {
		address: pairAddress,
		token1_address: token1Address,
		token2_address: token2Address,
	};

	const lpPair = await lpPairRepository().save(lpPairObj);

	return lpPair;
};
