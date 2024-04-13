import { NftPoolEntity } from "../entities/nftPool.entity";
import { getRepository } from "typeorm";
import * as lpPairRepository from "./lpPair.repository";

const nftPoolRepository = () => getRepository(NftPoolEntity);

export const getAllNftPools = async (page: number, limit: number) => {
	const queryBuilder = nftPoolRepository()
		.createQueryBuilder("nft_pools")
		.innerJoinAndSelect("nft_pools.lp_pair", "lp_pairs")
    .skip((page - 1) * limit)
    .take(limit);

	const [data, total] = await queryBuilder.getManyAndCount();
	return { total, data };
};

export const getNftPoolsByConditions = async (
  conditions: Record<string, any>
) => {
  return nftPoolRepository().find({ where: conditions });
};

export const getOneNftPoolByConditions = async (
  conditions: Record<string, any>
) => {
  return nftPoolRepository().findOne({
    where: conditions,
  });
};

export const getNftPoolByAddress = async (address: string) => {
	const queryBuilder = nftPoolRepository()
		.createQueryBuilder("nft_pools")
		// .leftJoinAndSelect("lp_pairs.nft_pool", "nft_pools")
		.where("LOWER(nft_pools.address) = LOWER(:address)", { address });

	const nftPool = await queryBuilder.getOne();
	return nftPool;
};

export const createNftPool = async (
	lpAddress: string,
	nftPoolAddress: string,
) => {
  const lpPair = await lpPairRepository.getPairByAddress(lpAddress);

	const nftPoolObj: Partial<NftPoolEntity> = {
    address: nftPoolAddress,
    lp_address: lpAddress,
    ...(lpPair ? { pair_id: lpPair.id } : {}),
	};

	const nftPool = await nftPoolRepository().save(nftPoolObj);

	return nftPool;
};

export const updateNftPool = async (
  lpAddress: string,
  pairId: string,
) => {
  // const lpPair = await lpPairRepository.getPairByAddress(lpAddress);

  // if (!lpPair) {
  //   throw new Error(`LpPair with address ${lpAddress} not found`);
  // }

  const nftPool = await nftPoolRepository()
    .createQueryBuilder("nft_pools")
    .select()
    .where("LOWER(lp_address) = LOWER(:lpAddress)", { lpAddress })
    .getOne();
  
  if (!nftPool) {
    console.log(`updateNftPool: No NftPool with lp_address=${lpAddress} found`);
    return;
  }

  nftPool.pair_id = pairId;
  return await nftPoolRepository().save(nftPool);
};
