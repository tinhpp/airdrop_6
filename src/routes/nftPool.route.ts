import { Router } from "express";
import * as NftPoolController from "../controllers/nftPool.controller";

const router = Router();

router.get("/", NftPoolController.getNftPoolData);

export default router;
