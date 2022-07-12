import { Request, Response } from "express";

import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardServices from "../services/cardServices.js"

interface CreateCard {
    employeeId: number;
    type: TransactionTypes;
}

interface Employee {
    id: number;
    fullName: string;
    cpf: string;
    email: string;
    companyId: number;
}

interface ActivateCard {
    cvc: string;
    password: string;
}


export async function createCard(req: Request, res: Response) {
    const cardData: CreateCard = req.body;
    const employeeData : Employee = res.locals.employee;

    const cvc = await cardServices.createCard(employeeData, cardData.type);

    res.status(201).send(cvc);
}

export async function activateCard(req: Request, res: Response) {
    const cardId = parseInt(req.params.cardId);

    if (isNaN(cardId) || !cardId) {
        throw {
            type: "unprocessableEntity",
            message: "Invalid cardId",
        };
    }

    const { cvc, password } : ActivateCard = req.body;

    await cardServices.activateCard(cardId, cvc, password);

    res.sendStatus(200);
}