import { Router } from "express";

import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { sendPaymentSchema } from "../schemas/paymentSchema.js";
import * as paymentControllers from "../controllers/paymentController.js";

export const paymentRouter = Router();

paymentRouter.post(
    "/payment",
    validateSchema(sendPaymentSchema),
    paymentControllers.sendPayment
);