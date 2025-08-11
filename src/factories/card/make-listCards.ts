import { CardPrismaRepository } from "@/repositories/prisma/card";
import { ListCards } from "@/services/card/listCards";


export function makeListCards(){

	const cardRepository = new CardPrismaRepository();
	const serviceListCards = new ListCards(
		cardRepository
	);


	return serviceListCards;
}