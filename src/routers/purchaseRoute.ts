
import { Router } from "express";
import { purchaseCard } from "../cotrollers/purchaseController.js";
import purchaseValidator from "../middlewares/purchaseValidator.js";


const purchaseRouter = Router();

purchaseRouter.post("/card-shopping" , purchaseValidator, purchaseCard)

export default purchaseRouter;