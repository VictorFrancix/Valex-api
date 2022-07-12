import { Request, Response, NextFunction } from "express";

import * as companyRepository from "./../repositories/companyRepository.js";
import * as employeeRepository from "./../repositories/employeeRepository.js";

export async function validateKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const key: string = req.header("x-api-key");

    if(!key){
        throw {
            type: "unprocessableEntity",
            message: "API key is required"
        }
    }

    const company = await companyRepository.findByApiKey(key);

    if (!company){
        throw {
            type: "unauthorized",
            message: "Invalid API Key"
        }
    }

    res.locals.companyId = company.id;
    next()
}

export async function checkEmployee(req: Request, res: Response, next: NextFunction) {
    const employeeId: number = req.body.employeeId;
    const companyId: number = res.locals.companyId;

    const employee = await employeeRepository.findById(employeeId);

    if(!employee){
        throw {
            type: "notFound",
            message: "Employee not found"
        }
    }

    if(employee.companyId !== companyId) {
        throw {
            type: "unauthorized",
            message: "Employee don't belong to company"
        }
    }

    res.locals.employee = employee;
    next();
}

