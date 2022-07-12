import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import * as auth from "../middlewares/authMiddleware.js"
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { createCardSchema } from "../schemas/cardSchema.js";

export const cardRouter = Router();

cardRouter.post(
    "/cards",
    auth.validateKey,
    validateSchema(createCardSchema),
    auth.checkEmployee,
    cardController.createCard
)