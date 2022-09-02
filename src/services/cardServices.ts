import {findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository.js"
import { findByApiKey } from "../repositories/companyRepository.js"
import { faker } from '@faker-js/faker';
import { number, string } from "joi";
import { findById } from "../repositories/employeeRepository.js";
import Cryptr from "cryptr"
import dayjs from 'dayjs'

const cryptr = new Cryptr('myTotallySecretKey');
async function verifyApi(apiKey:string) {
    const verifyApi:[] = await findByApiKey(apiKey)
    if(!verifyApi){
        throw {type:"not_found",message:"invalid api key"}
    }
}

async function verifyByTypeAndId(cardtype:TransactionTypes, employeeid:number) {
    const verifyTypeAndId = await findByTypeAndEmployeeId(cardtype,employeeid)
    console.log(" tyé ",verifyTypeAndId)
    if (verifyTypeAndId){
        throw {type:"conflict", message:"invalid operation"}
    }
}

async function createCard(employeeid:number, cardtype:string){
    //para criar um cartão precisamos de
    //numero do cartão OK
    //validade OK
    //nome do do dono 
    //cvc  OK
    const cardNum =  (faker.finance.account(16)).toString()
    const cardName = await setCardName(employeeid) 
    const cvcNumber = setCvv()
    const cvvdcryipt = cryptr.decrypt(cvcNumber)
    const cardDate = setExpirationDate()
    console.log("name ", cardName, " dte ", cardDate)
   }
   
 async function setCardName(employeeid:number) {
    const employee = await findById(employeeid)
    console.log(employee)
    if(!employee){
        throw{type:"not_found",message:"invalid id"}
    }
    const cardName = employee.fullName.toUpperCase()


    return cardName

 } 
 
 function setCvv(){
    const CVV =  faker.random.numeric(3)
   
    const cvvcryptr = cryptr.encrypt(CVV); 
    return  cvvcryptr
  }
  
  function setExpirationDate(){
    const expirationDate = dayjs().locale('pt-br').add(5,'years').format('MM/YY')
    return expirationDate
  }
export {
    createCard, verifyApi, verifyByTypeAndId
}