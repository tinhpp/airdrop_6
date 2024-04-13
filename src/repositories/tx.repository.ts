import { TransactionEntity } from "../entities/tx.entity";
import { getRepository } from "typeorm";

const txRepository = () => getRepository(TransactionEntity);

export const getAllTxs = async (page: number = 1, limit: number = 50) => {
	const queryBuilder = txRepository()
		.createQueryBuilder("transactions")
		.innerJoinAndSelect("transactions.lp_pair", "lp_pairs");
	const [data, total] = await queryBuilder
		.skip((page - 1) * limit)
		.take(limit)
		.getManyAndCount();

	return { total, data };
};

export const getLast24hTxs = async () => {
	const queryBuilder = txRepository()
		.createQueryBuilder("transactions")
		.innerJoinAndSelect("transactions.lp_pair", "lp_pairs")
		.where("transactions.created_at + INTERVAL '1 day' >= CURRENT_TIMESTAMP");

	const transactions = await queryBuilder.getMany();

	return transactions;
};

export const getTxsByPairAddress = async (
	address: string,
	getLast24h?: boolean
) => {
	const queryBuilder = txRepository()
		.createQueryBuilder("transactions")
		.innerJoinAndSelect("transactions.lp_pair", "lp_pairs")
		.where("LOWER(lp_pairs.address) = LOWER(:address)", { address });

	if (getLast24h) {
		queryBuilder.andWhere(
			"transactions.created_at + INTERVAL '1 day' >= CURRENT_TIMESTAMP"
		);
	}

	const transactions = await queryBuilder.getMany();

	return transactions;
};

export const createTx = async (
	pairId: string,
	txHash: string,
	token1Amount: string,
	token2Amount: string
) => {
	const txObj: Partial<TransactionEntity> = {
		pair_id: pairId,
		tx_hash: txHash,
		token1_amount: token1Amount,
		token2_amount: token2Amount,
	};

	const tx = await txRepository().save(txObj);

	return tx;
};
