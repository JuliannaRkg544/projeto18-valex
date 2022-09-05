import { findById } from "../repositories/cardRepository.js";
import { findByCardId } from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js"

async function getBalance(id: number) {
  await getCardData(id);
  const recharges: object = await getRecharges(id);
  const payments: object = await getPayments(id);
  return getTotalBalance(recharges, payments);
}

async function getCardData(id: number) {
  const cardData = await findById(id);
  if (!cardData)
    throw {
      type: "forbidden",message: "Card is not registered" };

  return cardData;
}

async function getRecharges(id:number){
    return await findByCardId(id)
}


async function getPayments(id:number){
    return await paymentRepository.findByCardId (id)
}

function getTotalBalance(recharges:any,payments:any){
    const getTransactions = payments.map((payment:any)=> payment.amount).reduce((a:number, b:number) => a + b,0)
    const getRecharges = recharges.map((recharge:any)=> recharge.amount).reduce((a:number, b:number) => a + b,0)
    const balance = getRecharges-getTransactions
    const response = {
            "balance": balance,
            "transactions": recharges,
            "recharges": payments
    }
    return response
}

export { getBalance };
