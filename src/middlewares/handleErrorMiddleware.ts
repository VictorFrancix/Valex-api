import { Request, Response, NextFunction } from "express";

export async function handleError(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error.type === "badRequest"){
        res.status(400).send(error.message)
    }
    else if (error.type === "unauthorized") {
        res.status(401).send(error.message);
    } else if (error.type === "notFound") {
        res.status(404).send(error.message);
    } else if(error.type === "conflict") {
        res.status(409).send(error.message);
    } else if (error.type === "unprocessableEntity") {
        res.status(422).send(error.message);
    } else {
        res.status(500).send(error.message);
    }
}