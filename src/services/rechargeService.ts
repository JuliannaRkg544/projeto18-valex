import { findByCardNumber } from "../repositories/cardRepository.js";
import { insert } from "../repositories/rechargeRepository.js";
import dayjs from "dayjs";

const actualDate = dayjs().locale("pt-br").format("MM/YY");

async function rechargeCard(cardNumber: string, rechargeValue: number) {
  const cardInfo = await findByCardNumber(cardNumber);
  if (!cardInfo) {
    throw { type: "not_found", message: "card not registered" };
  }
  const { id, expirationDate, isBlocked } = cardInfo;
  //somente cartões ativos
  if (isBlocked === true) {
    throw { type: "forbidden", message: "card not valid" };
  }
  //verificar se ja expirou
  checkDate(actualDate, expirationDate);

  //gerar timeStamp
  const timestamp = setTimestamp();
  //inserir card
  const rechargeData = {
    cardId: id,
    timestamp: timestamp,
    amount: rechargeValue,
  };

  await insert(rechargeData);
}
function setTimestamp() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  return today.toUTCString();
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

export { rechargeCard };
