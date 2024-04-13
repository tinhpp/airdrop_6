import { Router } from "express";
import * as TxController from "../controllers/tx.controller";

const router = Router();

router.get("/", TxController.getAllLpsTotalVolume);
router.get("/lp", TxController.getTotalVolumeByLp);

export default router;
