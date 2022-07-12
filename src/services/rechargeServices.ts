import * as cardUtils from "../utils/cardsUtils.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function sendRecharge(cardId: number, amount: number) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.checkExpired(cardData.expirationDate);
    cardUtils.checkActive(cardData.password, true);

    await rechargeRepository.insert({cardId, amount});
}