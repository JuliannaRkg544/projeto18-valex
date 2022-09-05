import { Router } from "express";
import { activateCard, blockCard, createCard, getBalance, unblockCard } from "../cotrollers/cardController.js";
import cardTypeValidator from "../middlewares/cardTypeValidator.js";
import employeeIdValidator from "../middlewares/employeeIdValidator.js";
import { apikeyValidator } from "../middlewares/apiKeyValidator.js";
import cardActivationValidator from "../middlewares/cardActivationMiddleware.js";
import cardBlockUnblockValidator from "../middlewares/cardBlockUnblockMiddleware.js";

const cardRouter = Router();

cardRouter.post("/card-creation", apikeyValidator, cardTypeValidator, employeeIdValidator, createCard);
cardRouter.post("/card-activation", cardActivationValidator, activateCard)
cardRouter.get("/card-balance/:id",getBalance)
cardRouter.put("/card-block", cardBlockUnblockValidator, blockCard)
cardRouter.put("/card-unblock", cardBlockUnblockValidator, unblockCard)

export default cardRouter;
