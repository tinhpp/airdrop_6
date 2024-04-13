import { Address } from "viem";

export const SERVER_PORT = process.env.SERVER_PORT || 4000;

/** Postgres DB */
export const DB_HOST = process.env.POSTGRES_DB_HOST || "localhost";
export const DB_PORT = process.env.POSTGRES_DB_PORT
	? parseInt(process.env.POSTGRES_DB_PORT)
	: 5432;
export const DB_DATABASE = process.env.POSTGRES_DB_DATABASE || "flashpaddb";
// export const DB_DATABASE = "flashpaddb";
export const DB_USERNAME = process.env.POSTGRES_DB_USERNAME || "postgres";
export const DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD || "postgres";
export const DB_MAX_CONNECTION = process.env.POSTGRES_DB_MAX_CONNECTION_POLL
	? parseInt(process.env.POSTGRES_DB_MAX_CONNECTION_POLL)
	: 20;

export const RPC_URL = process.env.RPC_URL || "https://rpc.goerli.linea.build";

export const PAIR_CREATED_EVENT_JOB_ENABLED =
	process.env.PAIR_CREATED_JOB_ENABLED === "true" || false;

export const SWAP_EVENT_JOB_ENABLED =
	process.env.SWAP_EVENT_JOB_ENABLED === "true" || false;

export const POOL_CREATED_EVENT_JOB_ENABLED =
	process.env.POOL_CREATED_EVENT_JOB_ENABLED === "true" || false;

export const CREATE_THUNDER_POOL_EVENT_JOB_ENABLED =
	process.env.CREATE_THUNDER_POOL_EVENT_JOB_ENABLED === "true" || false;

export const PAIR_FACTORY_ADDRESS =
	process.env.PAIR_FACTORY_ADDRESS ||
	"0xb19c2510dA6d5799FD23e43DA2CA8f5669C1C78d";

export const NFT_POOL_FACTORY_ADDRESS =
	process.env.NFT_POOL_FACTORY_ADDRESS ||
	"0x9374d8c4a89706f0f4d7B497ae12cd15CF3676D9";

export const FLASHPAD_MASTER_ADDRESS =
	process.env.FLASHPAD_MASTER_ADDRESS ||
	"0xAb7Aa215aC9eAeAE65601B8250Ae851Fb3E97D32";

export const THUNDER_POOL_FACTORY_ADDRESS =
	process.env.THUNDER_POOL_FACTORY_ADDRESS ||
	"0x5F622d1d08C7488d8632B8A42122f672041dd396";

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = process.env.REDIS_PORT
	? parseInt(process.env.REDIS_PORT, 10)
	: 6379;

export const DEFAULT_JOBS_START_BLOCK_NUMBER =
	Number(process.env.DEFAULT_JOBS_START_BLOCK_NUMBER) || 2665716;
// export const DEFAULT_JOBS_START_BLOCK_NUMBER = 2665716;

export const ONE_YEAR = 86400 * 365;

export const ADDRESS_ZERO: Address =
	"0x0000000000000000000000000000000000000000";

export const USD_PRICE = 1;
// export const WETH_ADDRESS =
// 	process.env.WETH_ADDRESS || "0xbe2C5113EebFe4C083da31346534CEA1cd2bBC46";

// export const FLASH_TOKEN_ADDRESS =
// 	process.env.FLASH_TOKEN_ADDRESS ||
// 	"0x85030dBAAc0739312dC9983363ca57E22A3AA2C1";

// export const XFLASH_TOKEN_ADDRESS =
// 	process.env.XFLASH_TOKEN_ADDRESS ||
// 	"0x9E48B10A010d0AF0217c63aef50589B10C0d1128";

// export const CHAINS_TOKENS_LIST = [
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0xD2340c4ec834bf43c05B9EcCd60EeD3a20892Dcc",
// 		tokenType: ["native"],
// 		address: "0xD2340c4ec834bf43c05B9EcCd60EeD3a20892Dcc",
// 		name: "APE",
// 		symbol: "APE",
// 		decimals: 18,
// 		createdAt: "2023-04-10",
// 		updatedAt: "2023-04-10",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png",
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0x5471ea8f739dd37E9B81Be9c5c77754D8AA953E4",
// 		tokenType: ["native"],
// 		address: "0x5471ea8f739dd37E9B81Be9c5c77754D8AA953E4",
// 		name: "Test BNB",
// 		symbol: "tBNB",
// 		decimals: 18,
// 		createdAt: "2023-06-23",
// 		updatedAt: "2023-06-23",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0xeEfF322f4590A1A84BB3486d4BA0038669A811aD",
// 		tokenType: ["native"],
// 		address: "0xeEfF322f4590A1A84BB3486d4BA0038669A811aD",
// 		name: "Test DOGE",
// 		symbol: "tDOGE",
// 		decimals: 18,
// 		createdAt: "2023-06-27",
// 		updatedAt: "2023-06-27",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0x6F03052743CD99ce1b29265E377e320CD24Eb632",
// 		tokenType: ["bridged"],
// 		address: "0x6F03052743CD99ce1b29265E377e320CD24Eb632",
// 		name: "HOP",
// 		symbol: "HOP",
// 		decimals: 18,
// 		createdAt: "2023-04-27",
// 		updatedAt: "2023-04-27",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/20547.png",
// 		extension: {
// 			rootChainId: 5,
// 			rootChainURI: "https://goerli.etherscan.io/block/0",
// 			rootAddress: "0x38aF6928BF1Fd6B3c768752e716C49eb8206e20c",
// 		},
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0xcAA61BCAe7D37Fe9C33c0D8671448254eef44D63",
// 		tokenType: ["native"],
// 		address: "0xcAA61BCAe7D37Fe9C33c0D8671448254eef44D63",
// 		name: "Matic",
// 		symbol: "MATIC",
// 		decimals: 18,
// 		createdAt: "2023-06-23",
// 		updatedAt: "2023-06-23",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0x7823e8dcc8bfc23ea3ac899eb86921f90e80f499",
// 		tokenType: ["bridged"],
// 		address: "0x7823e8dcc8bfc23ea3ac899eb86921f90e80f499",
// 		name: "Uniswap",
// 		symbol: "UNI",
// 		decimals: 18,
// 		createdAt: "2023-06-26",
// 		updatedAt: "2023-06-26",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
// 		extension: {
// 			rootChainId: 5,
// 			rootChainURI: "https://goerli.etherscan.io/block/0",
// 			rootAddress: "0x41E5E6045f91B61AACC99edca0967D518fB44CFB",
// 		},
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068",
// 		tokenType: ["bridged"],
// 		address: "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068",
// 		name: "Test USD Coin",
// 		symbol: "tUSDC",
// 		decimals: 18,
// 		createdAt: "2023-06-23",
// 		updatedAt: "2023-06-23",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
// 		extension: {
// 			rootChainId: 5,
// 			rootChainURI: "https://goerli.etherscan.io/block/0",
// 			rootAddress: "0xd35cceead182dcee0f148ebac9447da2c4d449c4",
// 		},
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0x1990BC6dfe2ef605Bfc08f5A23564dB75642Ad73",
// 		tokenType: ["bridged"],
// 		address: "0x1990BC6dfe2ef605Bfc08f5A23564dB75642Ad73",
// 		name: "Test USD Tether",
// 		symbol: "tUSDT",
// 		decimals: 6,
// 		createdAt: "2023-06-27",
// 		updatedAt: "2023-06-27",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
// 		extension: {
// 			rootChainId: 5,
// 			rootChainURI: "https://goerli.etherscan.io/block/0",
// 			rootAddress: "0xfad6367E97217cC51b4cd838Cc086831f81d38C2",
// 		},
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0x347b29EFca2f921fFc776Cdc01AF785f043368c6",
// 		tokenType: ["bridged"],
// 		address: "0x347b29EFca2f921fFc776Cdc01AF785f043368c6",
// 		name: "USD Tether",
// 		symbol: "USDT",
// 		decimals: 6,
// 		createdAt: "2023-06-27",
// 		updatedAt: "2023-06-27",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
// 		extension: {
// 			rootChainId: 5,
// 			rootChainURI: "https://goerli.etherscan.io/block/0",
// 			rootAddress: "0xfad6367E97217cC51b4cd838Cc086831f81d38C2",
// 		},
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0xDbcd5BafBAA8c1B326f14EC0c8B125DB57A5cC4c",
// 		tokenType: ["native"],
// 		address: "0xDbcd5BafBAA8c1B326f14EC0c8B125DB57A5cC4c",
// 		name: "Wrapped Bitcoin",
// 		symbol: "WBTC",
// 		decimals: 18,
// 		createdAt: "2023-06-23",
// 		updatedAt: "2023-06-23",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenId:
// 			"https://goerli.lineascan.build/token/0x2C1b868d6596a18e32E61B901E4060C872647b6C",
// 		tokenType: ["native"],
// 		address: "0x2C1b868d6596a18e32E61B901E4060C872647b6C",
// 		name: "Wrapped Ethereum",
// 		symbol: "WETH",
// 		decimals: 18,
// 		createdAt: "2023-06-26",
// 		updatedAt: "2023-06-26",
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png",
// 	},
// 	{
// 		chainId: 59140,
// 		chainURI: "https://goerli.lineascan.build/block/0",
// 		tokenType: ["native"],
// 		address: WETH_ADDRESS,
// 		name: "Ethereum",
// 		symbol: "ETH",
// 		decimals: 18,
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
// 	},
// 	{
// 		symbol: "BNB",
// 		name: "Binance Coin",
// 		address: "0xc1888F2Dc85A9C51F2f3f13fAaB5C06077bB235f",
// 		decimals: 8,
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/128x128/1839.png",
// 	},
// 	{
// 		symbol: "USDC",
// 		name: "USD Coin",
// 		address: "0xEc6BC0023a2607B88D8E0F3A67a5210d7BDb7534",
// 		decimals: 8,
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
// 	},
// 	{
// 		symbol: "DOGE",
// 		name: "DOGE Coin",
// 		address: "0x42472dB3d10d5AA6dE423F876CA555f803eF8ADD",
// 		decimals: 8,
// 		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
// 	},
// 	{
// 		symbol: "SHIB",
// 		name: "Shiba Coin",
// 		address: "0x8B57916D9C0a6D97422590eF545Dd721cF46734b",
// 		decimals: 8,
// 		// logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
// 		logoURI: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
// 	},
// 	{
// 		symbol: "FLASH",
// 		name: "Flash Token",
// 		address: FLASH_TOKEN_ADDRESS,
// 		decimals: 18,
// 	},
// 	{
// 		symbol: "xFLASH",
// 		name: "xFlash Token",
// 		address: XFLASH_TOKEN_ADDRESS,
// 		decimals: 18,
// 	},
// ];
