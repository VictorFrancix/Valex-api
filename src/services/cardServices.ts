import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {number} from "joi";

import * as cardRepository from "../repositories/cardRepository.js"
import { Employee } from "../repositories/employeeRepository.js";

dotenv.config();

export async function createCard(
    employee: Employee,
    type: cardRepository.TransactionTypes
    ) {
    
    await checkCardExists(type, employee.id)

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

    return cvc;
}

export async function checkCardExists(
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
    console.log(cvc)

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    
    const securityCode = cryptr.encrypt(cvc);

    return { cvc, securityCode }
}

export async function activateCard(cardId: number, password : string, cvc: string) {

    const cardData = await cardRepository.findById(cardId);

    if(!cardData){
        throw {
            type: "notFound",
            message: "Card not found"
        };
    }

    checkActivate(cardData.password, false);
    checkExpired(cardData.expirationDate);
    validateCvc(cvc, cardData.securityCode);

    const hash = bcrypt.hashSync(password, 10);

    await cardRepository.update(cardId, {password : hash});
    
}

function checkActivate(password: string | null, active: boolean) {
    if (password !== null && !active) {
        throw {
            type: "badRequest",
            message: "Card is already active",
        };
    } else if (password === null && active) {
        throw {
            type: "unauthorized",
            message: "Card is not active",
        };
    }

}

function checkExpired(expirationDate: string) {
    const date = expirationDate.split("/");
    const formatDate = dayjs().set("date", 1)
        .set("month", parseInt(date[0])).set("year", parseInt(date[1]))
        .format("DD/MM/YYYY");
    if (new Date() > new Date(formatDate)) {
        throw {
            type: "badRequest",
            message: "Expired card",
        };
    }
}

function validateCvc(cvcInserted: string, encryptedCvc: string) {
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const decryptedCvc = cryptr.decrypt(encryptedCvc);
    console.log(decryptedCvc)

    if (cvcInserted !== decryptedCvc) {
        throw {
            type: "unauthorized",
            message: "Invalid cvc",
        };
    }
}
