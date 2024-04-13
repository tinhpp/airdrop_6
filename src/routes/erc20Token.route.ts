import { Router } from "express";
import * as Erc20TokenController from "../controllers/erc20Token.controller";

const router = Router();

router.get("/", Erc20TokenController.getERC20Tokens);
router.post("/", Erc20TokenController.addERC20Token);

export default router;
