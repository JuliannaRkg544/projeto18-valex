import { Request,Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardServices from "../services/cardServices.js"

export async function createCard(req: Request, res:Response ) {
    const {employeeid, cardtype}:{employeeid:number, cardtype:TransactionTypes} = req.body
    const apiKey = res.locals.apiKey

        //apikey
         await cardServices.verifyApi(apiKey)
         await cardServices.verifyByTypeAndId(cardtype,employeeid)
         await cardServices.createCard(employeeid,cardtype) 


        res.sendStatus(200)
        
   

}