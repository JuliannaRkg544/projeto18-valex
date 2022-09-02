import { Request,Response,NextFunction } from "express";

export default function errorHandler(error, req:Request, res:Response, next:NextFunction){
    console.log(error);
    if(error.type==="not_found") return res.status(404).send(error.message)
    if(error.type==="conflict") return res.status(401).send(error.message)
    if(error.type==="bad_request") return res.status(400).send(error.message)
    if(error.type==="unprocessable") return res.status(422).send(error.message)
    return res.sendStatus(500)
}