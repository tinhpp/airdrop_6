import { getRepository } from "typeorm";
import { ThunderPoolEntity } from "../entities/thunderPool.entity";
import * as nftPoolRepository from "./nftPool.repository";

const thunderPoolRepository = () => getRepository(ThunderPoolEntity);

export const getAllThunderPools = async (page: number, limit: number) => {
	const queryBuilder = thunderPoolRepository()
		.createQueryBuilder("thunder_pools")
		.innerJoinAndSelect("thunder_pools.nft_pool", "nft_pools")
		.skip((page - 1) * limit)
		.take(limit);

	const [data, total] = await queryBuilder.getManyAndCount();
	return { total, data };
};

export const getThunderPoolsByConditions = async (
	conditions: Record<string, any>
) => {
	return thunderPoolRepository().find({ where: conditions });
};

export const getOneThunderPoolByConditions = async (
	conditions: Record<string, any>
) => {
	return thunderPoolRepository().findOne({
		where: conditions,
		relations: ["nft_pool", "nft_pool.lp_pair"],
	});
};

export const getThunderPoolByAddress = async (address: string) => {
	const queryBuilder = thunderPoolRepository()
		.createQueryBuilder("thunder_pools")
		.leftJoinAndSelect("thunder_pools.nft_pool", "nft_pool")
		.where("LOWER(thunder_pools.address) = LOWER(:address)", { address });

	const thunderPool = await queryBuilder.getOne();
	return thunderPool;
};

export const createThunderPool = async (
	thunderPoolAddress: string,
	nftPoolAddress: string
) => {
	const nftPool = await nftPoolRepository.getNftPoolByAddress(nftPoolAddress);

	const thunderPoolObj: Partial<ThunderPoolEntity> = {
		address: thunderPoolAddress,
		...(nftPool ? { nft_pool_id: nftPool.id } : {}),
	};

	const thunderPool = await thunderPoolRepository().save(thunderPoolObj);

	return thunderPool;
};
