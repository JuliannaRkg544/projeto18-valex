import { Router } from "express";
import { createCard } from "../cotrollers/createCard.js";
// import { apikeyValidator } from "../middlewares/apiKeyValidator.js";
import cardTypeValidator from "../middlewares/cardTypeValidator.js";
import employeeIdValidator from "../middlewares/employeeIdValidator.js";
import { NextFunction, Request, Response } from "express";
import apiKeySchema from "../schemas/apiKeySchema.js";
import { apikeyValidator } from "../middlewares/apiKeyValidator.js";

const createCardRouter = Router();
console.log("no router do card");
createCardRouter.post(
  "/create-card", apikeyValidator, cardTypeValidator, employeeIdValidator, createCard
);



export default createCardRouter;
