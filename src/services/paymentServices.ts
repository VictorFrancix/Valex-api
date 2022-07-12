import { SendPaymentBody } from "../controllers/paymentController.js";
import * as cardUtils from "../utils/cardsUtils.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

export async function sendPayment({
    cardId,
    businessId,
    amount,
    password,
}: SendPaymentBody) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.checkActive(cardData.password, true);
    cardUtils.checkExpired(cardData.expirationDate);
    cardUtils.checkBlocked(cardData.isBlocked, false);
    cardUtils.validatePassword(password, cardData.password);
    await cardUtils.checkCardAndBusinessType(cardData.type, businessId);
    await cardUtils.checkCardBalance(cardId, amount);

    await paymentRepository.insert({cardId, businessId, amount});
}