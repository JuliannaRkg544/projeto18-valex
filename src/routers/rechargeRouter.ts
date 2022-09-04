
import { Router } from "express";
import { rechargeCard } from "../cotrollers/rechargeController.js";
import { apikeyValidator } from "../middlewares/apiKeyValidator.js";
import rechargeValidator from "../middlewares/rechargeValidator.js";

const rechargeRouter = Router();

rechargeRouter.post("/card-recharge", apikeyValidator, rechargeValidator , rechargeCard )

export default rechargeRouter;