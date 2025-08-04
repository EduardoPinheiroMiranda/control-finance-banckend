import { CardPrismaRepository } from "oldCode/src/repositories/prisma/card";
import { UpdateCard } from "oldCode/src/services/card/updateCard";


export function makeUpdateCard(){

	const cardRepository = new CardPrismaRepository();
	const serviceUpdateCard = new UpdateCard(
		cardRepository
	);


	return serviceUpdateCard;
}