import { NextFunction, Request, Response } from "express";
import apiKeySchema from "../schemas/apiKeySchema.js";

export function apikeyValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"].toString()
  if (!apiKey) {
    return res.status(400).send("inexistent key");
  }
  const validateApiKey = apiKeySchema.validate({ apiKey });
  if (validateApiKey.error) {
    console.log(validateApiKey.error.details);
    return res.status(422).send("invalid key");
  }
  res.locals.apiKey = apiKey
  console.log(res.locals)
  next();
}
