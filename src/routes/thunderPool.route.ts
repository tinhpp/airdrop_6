import { Router } from "express";
import * as ThunderPoolController from "../controllers/thunderPool.controller";

const router = Router();

router.get("/info/:address", ThunderPoolController.getInfo);
router.get("/", ThunderPoolController.getAllThunderPoolsData);

export default router;
