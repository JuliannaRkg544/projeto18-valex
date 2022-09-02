import {NextFunction, Request, Response} from  "express"
import employeeIdSchema from "../schemas/employeeIdSchema.js"

export default function employeeIdValidator(req:Request, res:Response, next:NextFunction){
    const {employeeid} = req.body
    if(!employeeid){
       return res.status(400).send("inexistent id")
    }
    const idValidate = employeeIdSchema.validate({employeeid})
    if(idValidate.error){
        console.log(idValidate.error.details)
        return res.status(422).send("invalid id")
    }
    next()
}