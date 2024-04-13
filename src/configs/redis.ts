import { createClient } from "redis";
import { promisify } from "util";
import { REDIS_HOST, REDIS_PORT } from "./constants";

export const redisClient = createClient({
	host: REDIS_HOST,
	port: REDIS_PORT,
	disable_resubscribing: false,
});

redisClient.on("connect", () => {
	if (process.env.NODE_ENV !== "test") {
		console.log("Redis client connected");
	}
});

redisClient.on("error", (error: any) => {
	console.error(`Unhandled Exception: ${error.message}.`);
});

export const rGet = promisify(redisClient.get).bind(redisClient);
export const rSet = promisify(redisClient.set).bind(redisClient);
export const rHget = promisify(redisClient.hget).bind(redisClient);
export const rHset = promisify(redisClient.hset).bind(redisClient);
export const rSetnx = promisify(redisClient.setnx).bind(redisClient);
export const rExpire = promisify(redisClient.expire).bind(redisClient);
export const rDel = promisify(redisClient.del).bind(redisClient);
export const rIncr = promisify(redisClient.incr).bind(redisClient);
