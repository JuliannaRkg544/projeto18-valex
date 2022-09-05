import * as cardRepository from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { faker } from "@faker-js/faker";
import { findById } from "../repositories/employeeRepository.js";
import Cryptr from "cryptr";
import dayjs from "dayjs";


const cryptr = new Cryptr("myTotallySecretKey");
const actualDate = dayjs().locale("pt-br").format("MM/YY");


async function verifyApi(apiKey: string) {
  const verifyApi: [] = await findByApiKey(apiKey);
  if (!verifyApi) {
    throw { type: "not_found", message: "invalid api key" };
  }
}

async function verifyByTypeAndId(
  cardtype: cardRepository.TransactionTypes,
  employeeid: number
) {
  const verifyTypeAndId = await cardRepository.findByTypeAndEmployeeId(cardtype, employeeid);
  if (verifyTypeAndId) {
    throw { type: "conflict", message: "invalid operation" };
  }
}

async function createCard(employeeid: number, cardtype: cardRepository.TransactionTypes) {
  const cardData: any = await setCardData(employeeid, cardtype);
  await cardRepository.insert(cardData);
  return cardData;
}

async function setCardName(employeeid: number) {
  const employee = await findById(employeeid);
  if (!employee) {
    throw { type: "not_found", message: "invalid id" };
  }
  let name = employee.fullName.toUpperCase().split(" ");
  const fisrtName = name[0];
  const lastName = name[name.length - 1];
  name.pop();
  name.shift();
  let middleName = name.map((n: string) => {
    if (n.length > 2) return n[0];
  });
  const cardName = fisrtName + " " + middleName + " " + lastName;

  return cardName;
}

function setCvv() {
  const CVV = faker.random.numeric(3);
  const cvcryptr = cryptr.encrypt(CVV);
  return cvcryptr;
}

function setExpirationDate() {
  const expirationDate = dayjs()
    .locale("pt-br")
    .add(5, "years")
    .format("MM/YY");
  return expirationDate;
}
async function setCardData(employeeid: number, cardtype: cardRepository.TransactionTypes) {
  const cardNum = faker.finance.account(16).toString();
  const cardName = await setCardName(employeeid);
  const cvcNumber = setCvv().toString();
  const cardDate = setExpirationDate().toString();
  let password: string = null;
  let type = cardtype;
  let isBlocked = true;
  let isVirtual = false;
  let originalCardId: number = null;

  const cardData = {
    employeeId: employeeid,
    number: cardNum,
    cardholderName: cardName,
    securityCode: cvcNumber,
    expirationDate: cardDate,
    password,
    isVirtual,
    isBlocked,
    type,
  };
  return cardData;
}

async function verifyByCardDetails(
  number: string,
  cardholderName: string,
  expirationDate: string,
  cvc: string,
  password: string
) {
  const cardInfo = await cardRepository.findByCardDetails(
    number,
    cardholderName,
    expirationDate
  );
  if (!cardInfo) {
    throw { type: "not_found", message: "card informations not found" };
  }

  checkDate(actualDate, expirationDate);

  const passwordInfo = cardInfo.password;
  const isBlocked = cardInfo.isBlocked;
  if (passwordInfo || isBlocked === false) {
    throw { type: "forbidden", message: "card already activated" };
  }


  const id = cardInfo.id;
  const cvcv = cryptr.decrypt(cardInfo.securityCode);
  console.log("cvc", cvcv);
  await activateCard(cvc, password, id, cardInfo);
}
async function activateCard(
  cvc: string,
  password: string,
  id: number,
  cardInfo: any
) {
  console.log(cardInfo);

  let securityCode = cryptr.decrypt(cardInfo.securityCode);

  if (securityCode !== cvc) {
    throw { type: "forbidden", message: "security code not valid" };
  }

  const passwordCripted = cryptr.encrypt(password);

  const cardData = cardDataBuilder(
    id,
    cardInfo.employeeId,
    cardInfo.number,
    cardInfo.cardholderName,
    cardInfo.securityCode,
    cardInfo.expirationDate,
    passwordCripted,
    cardInfo.isVirtual,
    false,
    cardInfo.type
  );

  await cardRepository.update(id, cardData);
}

async function blockCard(cardNumber: string, password: string) {
  const cardInfo = await cardRepository.findByCardNumber(cardNumber);
  if (!cardInfo) {
    throw { type: "not_found", message: "card not found" };
  }
  let expirationDate = cardInfo.expirationDate;

  checkDate(actualDate, expirationDate);

  let { isBlocked } = cardInfo;

  if (isBlocked === true) {
    throw { type: "forbidden", message: "card already blocked" };
  }
  checkPassword(password, cardInfo.password);

  const cardData = cardDataBuilder(
    cardInfo.id,
    cardInfo.employeeId,
    cardInfo.number,
    cardInfo.cardholderName,
    cardInfo.securityCode,
    cardInfo.expirationDate,
    cardInfo.password,
    cardInfo.isVirtual,
    true,
    cardInfo.type
  );
  await cardRepository.update(cardInfo.id, cardData)
  
}

function cardDataBuilder(
  id: number,
  employeeId: number,
  number: string,
  cardholderName: string,
  securityCode: string,
  expirationDate: string,
  password: string,
  isVirtual: boolean,
  isBlocked: boolean,
  type: cardRepository.TransactionTypes
) {
  const cardData = {
    id,
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password,
    isVirtual,
    originalCardId:null,
    isBlocked,
    type
  };

  return cardData;
}

function checkPassword(passwordToCheck: string, rightPassword: string) {
  if(rightPassword===null){
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

async function unblockCard(cardNumber: string, password: string){
  const cardInfo = await cardRepository.findByCardNumber(cardNumber);
  if (!cardInfo) {
    throw { type: "not_found", message: "card not found" };
  }

  let expirationDate = cardInfo.expirationDate;

  checkDate(actualDate,expirationDate)

  let { isBlocked } = cardInfo;

  if (isBlocked === false) {
    throw { type: "forbidden", message: "card already unblocked" };
  }
 

  checkPassword(password, cardInfo.password);

  const cardData = cardDataBuilder(
    cardInfo.id,
    cardInfo.employeeId,
    cardInfo.number,
    cardInfo.cardholderName,
    cardInfo.securityCode,
    cardInfo.expirationDate,
    cardInfo.password,
    cardInfo.isVirtual,
    false,
    cardInfo.type
  );
  await cardRepository.update(cardInfo.id, cardData)
}

export {
  createCard,
  verifyApi,
  verifyByTypeAndId,
  verifyByCardDetails,
  activateCard,
  blockCard,
  unblockCard
};
