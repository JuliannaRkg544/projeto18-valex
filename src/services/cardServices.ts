import {
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  CardInsertData,
} from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { faker } from "@faker-js/faker";
import { findById } from "../repositories/employeeRepository.js";
import Cryptr from "cryptr";
import dayjs from "dayjs";

const cryptr = new Cryptr("myTotallySecretKey");

async function verifyApi(apiKey: string) {
  const verifyApi: [] = await findByApiKey(apiKey);
  if (!verifyApi) {
    throw { type: "not_found", message: "invalid api key" };
  }
}

async function verifyByTypeAndId(
  cardtype: TransactionTypes,
  employeeid: number
) {
  const verifyTypeAndId = await findByTypeAndEmployeeId(cardtype, employeeid);
  if (verifyTypeAndId) {
    throw { type: "conflict", message: "invalid operation" };
  }
}

async function createCard(employeeid: number, cardtype: TransactionTypes) {
 
  const cardData: CardInsertData = await setCardData(employeeid,cardtype)
  await insert(cardData);

}

async function setCardName(employeeid: number) {
  const employee = await findById(employeeid);
  console.log(employee);
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

  const cvvcryptr = cryptr.encrypt(CVV);
  return cvvcryptr;
}

function setExpirationDate() {
  const expirationDate = dayjs()
    .locale("pt-br")
    .add(5, "years")
    .format("MM/YY");
  return expirationDate;
}
async function setCardData(employeeid: number, cardtype: TransactionTypes) {
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
    employeeid,
    cardNum,
    cardName,
    cvcNumber,
    cardDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    type,
  };
  return cardData
}
export { createCard, verifyApi, verifyByTypeAndId };
