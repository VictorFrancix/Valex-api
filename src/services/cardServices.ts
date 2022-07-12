import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js"
import { Employee } from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as cardUtils from "../utils/cardsUtils.js";

dotenv.config();

export async function createCard(
    employee: Employee,
    type: cardRepository.TransactionTypes
    ) {
    
    await cardUtils.checkCardExists(type, employee.id)

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

    
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.checkActive(cardData.password, false);
    cardUtils.checkExpired(cardData.expirationDate);
    cardUtils.validateCvc(cvc, cardData.securityCode);

    const hash = bcrypt.hashSync(password, 10);

    await cardRepository.update(cardId, {password : hash});
    
}

export async function getTransactions(cardId: number) {
    const cardData = await cardUtils.getCardData(cardId);

    const payments = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);

    const balance = calculateBalance(payments, recharges);

    const transactions = {
        balance: balance,
        transactions: payments,
        recharges: recharges
    };

    return transactions;
}

function calculateBalance(
    payments: paymentRepository.PaymentWithBusinessName[],
    recharges: rechargeRepository.Recharge[]
) {
    let paymentsTotal = 0;
    payments.forEach((payment) => {
        paymentsTotal += payment.amount;
    });

    let rechargesTotal = 0;
    recharges.forEach((recharge) => {
        rechargesTotal += recharge.amount;
    });

    const balance = rechargesTotal - paymentsTotal;

    return balance;
}

export async function blockCard(cardId: number, password: string) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.validatePassword(password, cardData.password);
    cardUtils.checkExpired(cardData.expirationDate);
    cardUtils.checkBlocked(cardData.isBlocked, false);

    await cardRepository.update(cardId, { isBlocked: true });
}

export async function unlockCard(cardId: number, password: string) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.validatePassword(password, cardData.password);
    cardUtils.checkExpired(cardData.expirationDate);
    cardUtils.checkBlocked(cardData.isBlocked, true);

    await cardRepository.update(cardId, { isBlocked: false });
}