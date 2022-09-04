import { Request,Response,NextFunction } from "express";
import blockUnblockSchema from "../schemas/cardBlockUnblockSchema.js";

export default function cardBlockUnblockValidator(req:Request, res:Response, next:NextFunction){
    const cardInfo = req.body
    const cardValidator = blockUnblockSchema.validate(cardInfo)

    if(cardValidator.error){
        console.log(cardValidator.error.details);
        return res.status(422).send(cardValidator.error.details)
    }
    next()
}