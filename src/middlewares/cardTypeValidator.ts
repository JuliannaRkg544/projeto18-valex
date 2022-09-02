import { Request, Response, NextFunction } from "express";
import cardTypeSchema from "../schemas/cardTypeSchema.js";

export default function cardTypeValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {cardtype} = req.body;
  console.log("no cardtype nidd ", cardtype)
  if (!cardtype) {
    return res.status(422).send("inexistent card type");
  }

  const validateCardType = cardTypeSchema.validate({ cardtype });
  if (validateCardType.error) {
    console.log(validateCardType.error.details);
    return res.status(422).send("invalid card type");
  }

//   res.locals = cardType;

  next();
}
