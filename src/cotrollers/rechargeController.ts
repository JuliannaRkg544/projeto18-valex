import {Response, Request} from "express"
import *  as rechargeService from "../services/rechargeService.js"

export async function rechargeCard(req: Request, res:Response){
  const {cardNumber, rechargeValue}:{cardNumber:string, rechargeValue:number}=req.body
  
  await rechargeService.rechargeCard(cardNumber,rechargeValue)
  res.sendStatus(201)
}