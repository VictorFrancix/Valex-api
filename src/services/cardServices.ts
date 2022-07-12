import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";

import * as cardRepository from "../repositories/cardRepository.js"
import { Employee } from "../repositories/employeeRepository.js";

dotenv.config();

export async function createCard(
    employee: Employee,
    type: cardRepository.TransactionTypes
    ) {
    
    await checkCardTypeExists(type, employee.id)

    const cardNumber: string = faker.finance.creditCardNumber("#### #### #### ####");
    const cardholderName: string = cardHolderFormart(employee.fullName);
    const expirationDate: string = createExpirationDate();
    const { cvc, securityCode } = createCVC();

    const card: cardRepository.CardInsertData = {
        employeeId: employee.id,
        number: cardNumber,
        cardholderName: cardholderName,
        securityCode: securityCode,
        expirationDate: expirationDate,
        isVirtual: false,
        isBlocked: false,
        type: type,
    };

    await cardRepository.insert(card);
}

export async function checkCardTypeExists(
    type:cardRepository.TransactionTypes,
    employeeId: number
    ) {
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

    if (card) {
        throw {
            type: "conflict",
            message: "card already exists"
        }
    }
    
}

export function cardHolderFormart(employeeName: string) {
    let names  = employeeName.split(" ");
    let cardHolderName = [];
    for (let name of names){

        if(name === names[0]){
            cardHolderName.push(name)
        }
        if(name.length >= 3 && name !== names[names.length - 1] && name !== names[0]){
            cardHolderName.push(name[0])
        }
    }
    cardHolderName.push(names[names.length-1])

    return cardHolderName.join(" ").toUpperCase();
}

function createExpirationDate(){
    const date = new Date();
    
    const expiration = dayjs(date).add(5,"y").format("MM/YY")
    
    return expiration
}

function createCVC() {
    const cvc = faker.finance.creditCardCVV();

    const cryptr = new Cryptr(process.env.CRYPT_SECRET);
    
    const securityCode = cryptr.encrypt(cvc);

    return { cvc, securityCode }
}