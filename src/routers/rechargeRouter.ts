import { Router } from "express";

import * as rechargeController from "../controllers/rechargeController.js";
import * as auth from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { sendRechargeSchema } from "../schemas/rechargeSchema.js"

export const rechargeRouter = Router();

rechargeRouter.post(
    "/recharge",
    validateSchema(sendRechargeSchema),
    auth.validateKey,
    rechargeController.sendRecharge
);