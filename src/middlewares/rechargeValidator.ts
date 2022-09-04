import rechargeSchema from "../schemas/rechargeSchema.js";
import { Response, Request, NextFunction } from "express";

export default function rechargeValidator(req:Request, res:Response, next: NextFunction){
  const rechargeInfo = req.body

  const rechargeValidate = rechargeSchema.validate(rechargeInfo)

  if(rechargeValidate.error){
    return res.status(422).send(rechargeValidate.error.message)
  }
  next()
}