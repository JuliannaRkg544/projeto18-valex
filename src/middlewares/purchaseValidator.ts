import purchaseSchema from "../schemas/purchaseSchema.js";
import { Response,Request, NextFunction } from "express";

export default function purchaseValidator(req:Request, res:Response, next:NextFunction){

    const purchaseInfo = req.body;

    const purchaseValidate = purchaseSchema.validate(purchaseInfo)
    if(purchaseValidate.error){
        return res.status(422).send(purchaseValidate.error.details)
    }
    next()
}

