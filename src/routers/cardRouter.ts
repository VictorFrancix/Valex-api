import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import * as auth from "../middlewares/authMiddleware.js"
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import * as cardSchema from "../schemas/cardSchema.js";

export const cardRouter = Router();

cardRouter.post(
    "/cards",
    auth.validateKey,
    validateSchema(cardSchema.createCardSchema),
    auth.checkEmployee,
    cardController.createCard
);

cardRouter.patch(
    "/cards/:cardId/activate",
    validateSchema(cardSchema.activateCardSchema),
    cardController.activateCard
);