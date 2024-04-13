import * as thunderPoolRepository from "../repositories/thunderPool.repository";

export const getThunderPoolByAddress = (address: string) => {
	return thunderPoolRepository.getOneThunderPoolByConditions({ address });
};
