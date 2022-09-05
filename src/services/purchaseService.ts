import { findByCardNumber } from "../repositories/cardRepository.js";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import { findById } from "../repositories/businessRepository.js";
import { findByCardId, insert } from "../repositories/rechargeRepository.js";
import * as paymaentRepository from "../repositories/paymentRepository.js"

const cryptr = new Cryptr("myTotallySecretKey");

const actualDate = dayjs().locale("pt-br").format("MM/YY");

let cardType:string = null

async function payShopping(
  cardNumber: string,
  password: string,
  businessId: number,
  purchaseValue: number
) {
  const cardId = await verifyCardIntegraty(cardNumber, password,purchaseValue);
  await verifyBusinessIntegraty(businessId, purchaseValue, cardType);
  
  //persistir compra

  const paymentData = {
    cardId,
    businessId,
    amount:purchaseValue
  }

  await paymaentRepository.insert(paymentData)

  
}

async function verifyCardIntegraty(cardNumber: string, password: string,purchaseValue:number) {
  const cardInfo = await findByCardNumber(cardNumber);
  //verifica cadastro
  if (!cardInfo) {
    throw { type: "not_found", message: "card number not found" };
  }
  //verifica se ta ativo
  const cardPassword = cardInfo.password;
  if (cardPassword === null) {
    throw { type: "forbbiden", message: "card unactivate" };
  }
  //verifica se esta desbloqueado
  const { isBlocked } = cardInfo;
  if (isBlocked === true) {
    throw { type: "forbbiden", message: "card blocked" };
  }
  //verifica senha


  checkPassword(password, cardInfo.password);

  //verifica data
  checkDate(actualDate, cardInfo.expirationDate);
  //tipo do card
  cardType = cardInfo.type

  await compareDebitCredit(cardInfo.id,purchaseValue)

  return cardInfo.id
}

function checkPassword(passwordToCheck: string, rightPassword: string) {
  if (rightPassword === null) {
    throw { type: "forbidden", message: "invalid operation" };
  }
  rightPassword = cryptr.decrypt(rightPassword);
  if (passwordToCheck !== rightPassword) {
    throw { type: "forbidden", message: "invalid password" };
  }
}
function checkDate(actualDate: string, expirationDate: string) {
  let todayDate = actualDate.split("/");
  let cardDate = expirationDate.split("/");

  if (cardDate[1] < todayDate[1]) {
    console.log(actualDate);
    throw { type: "forbidden", message: "invalid date" };
  } else if (cardDate[1] === todayDate[1]) {
    if (cardDate[0] < todayDate[0]) {
      throw { type: "forbidden", message: "invalid date" };
    }
  }
}

async function verifyBusinessIntegraty(
  businessId: number,
  purchaseValue: number,
  cardType: string
) {
    //verifica cadastro da empresa
    const businessInfo = await findById(businessId)
    if(!businessInfo){
        throw { type: "not_found", message: "business not found" };
    }
    //verifica tipo do cartõ e empresa
    const {type} = businessInfo
    if(type!==cardType){
        throw { type: "forbidden", message: "invalid card operator" };
    }
    //verifica saldo:
       // somar amount de recharges by cardId  OK
       //somar amount de payments by cardId OK
       //comparar
    //inserir paymnet
}


async function compareDebitCredit(cardId:number, purchaseValue:number){
  const totalRechargesValue = await verifyCredit(cardId)
  let totalPurchasesValue:number = await verifyDebit(cardId)
  if (totalPurchasesValue===0){
    console.log(totalPurchasesValue, " tipo ", typeof totalPurchasesValue)
    totalPurchasesValue = purchaseValue
  }
  //se o debito for maior que o credito n posso comprar
  if(Number(totalPurchasesValue)+Number(purchaseValue)>totalRechargesValue){
    console.log("total de compras ",Number(totalPurchasesValue)+Number(purchaseValue),"total de recharges", totalRechargesValue)
    throw { type: "forbidden", message: "not credit on this card" };
  }
}

async function verifyCredit(cardId: number) {
   const cardRecharges = await findByCardId(cardId)
   if(cardRecharges.length===0){
    throw { type: "forbidden", message: "no credit in this card" };
   }
   const creditArray = cardRecharges.map((card:any)=>{return card.amount})
   let creditValue = creditArray.reduce((cont:any,value:number)=>cont+value)
  return creditValue
}
async function verifyDebit(cardId: number) {
  let debitValue:number
  const cardPurchases = await paymaentRepository.findByCardId(cardId)
  if(cardPurchases.length===0){
    return debitValue = 0
  }
  const purchaseArray = cardPurchases.map((card:any)=>{return card.amount})
  debitValue = purchaseArray.reduce((cont:any,value:number)=>cont+value)
  return debitValue
}


export { payShopping };
