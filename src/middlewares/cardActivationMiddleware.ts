import { Response,Request,NextFunction } from "express";
import cardActivationSchema from "../schemas/cardActivationSchema.js";

export default function cardActivationValidator(req:Request, res:Response, next:NextFunction){
  const cardInfo = req.body
  const cardValidator = cardActivationSchema.validate(cardInfo)
  if(cardValidator.error){
    console.log(cardValidator.error.details)
    return res.sendStatus(422)
  }
  next()
}