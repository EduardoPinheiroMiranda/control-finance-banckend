import { CardPrismaRepository } from "oldCode/src/repositories/prisma/card";
import { ListCards } from "oldCode/src/services/card/listCards";


export function makeListCards(){

	const cardRepository = new CardPrismaRepository();
	const serviceListCards = new ListCards(
		cardRepository
	);


	return serviceListCards;
}