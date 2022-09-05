import { Request, Response } from "express";
import { payShopping } from "../services/purchaseService.js";

export async function purchaseCard(req: Request, res: Response) {
  const {
    cardNumber,
    password,
    businessId,
    purchaseValue,
  }: {
    cardNumber: string;
    password: string;
    businessId: number;
    purchaseValue: number;
  } = req.body;

  await payShopping( cardNumber,
    password,
    businessId,
    purchaseValue,)

  res.sendStatus(201)
}
