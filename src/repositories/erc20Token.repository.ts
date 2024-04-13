import { Erc20TokenEntity } from "../entities/erc20Token.entity";
import { getRepository } from "typeorm";

const erc20TokenRepository = () => getRepository(Erc20TokenEntity);

export const getAllERC20Tokens = async (page: number = 1, limit: number = 1000) => {
	const [data, total] = await erc20TokenRepository()
  .findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });

	return { total, data };
};

export const addERC20Token = async (
	address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoURI: string,
) => {
	const erc20TokenObj: Partial<Erc20TokenEntity> = {
    address: address.toLowerCase(),
		name,
    symbol,
    decimals,
    logo_uri: logoURI,
	};

	const erc20TokenEntity = await erc20TokenRepository().save(erc20TokenObj);

	return erc20TokenEntity;
};
