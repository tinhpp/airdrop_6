import { Router } from "express";
import * as LpPairController from "../controllers/lpPair.controller";

const router = Router();

router.get("/", LpPairController.getLpPairs);
router.get("/all-pools", LpPairController.getAllPairsDataForAllPool);
router.get("/positions", LpPairController.getAllPairsDataForPosition);
router.get("/all-pools-info", LpPairController.getInfoOfAllPool);

export default router;
