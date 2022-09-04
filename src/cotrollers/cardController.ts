import { NextFunction, Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardServices from "../services/cardServices.js";

export async function createCard(req: Request, res: Response) {
  const {
    employeeid,
    cardtype,
  }: { employeeid: number; cardtype: TransactionTypes } = req.body;
  const apiKey = res.locals.apiKey;

  await cardServices.verifyApi(apiKey);
  await cardServices.verifyByTypeAndId(cardtype, employeeid);
  const cardData = await cardServices.createCard(employeeid, cardtype);

  res.status(201).send(cardData);
}

export async function activateCard(req:Request, res:Response) {
  const {cardNumber, cardholderName, expirationDate, cvc ,password}:{cardNumber:string, cardholderName:string ,expirationDate:string, cvc:string ,password:string} = req.body
  await cardServices.verifyByCardDetails(cardNumber,cardholderName,expirationDate,cvc,password)
  res.sendStatus(200)
  // await cardServices.activateCard(cardNumber,cardholderName,expirationDate,cvc,password)
}

export async function blockCard(req:Request, res:Response) {
  const {cardNumber, password}:{cardNumber:string, password:string} = req.body
  
  await cardServices.blockCard(cardNumber,password)
  res.sendStatus(200)
}

export async function unblockCard(req: Request, res:Response) {
  const {cardNumber, password}:{cardNumber:string, password:string} = req.body

  await cardServices.unblockCard(cardNumber,password)
  res.sendStatus(200)
}
