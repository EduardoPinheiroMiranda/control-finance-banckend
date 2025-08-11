import { CardPrismaRepository } from "@/repositories/prisma/card";
import { UpdateCard } from "@/services/card/updateCard";


export function makeUpdateCard(){

	const cardRepository = new CardPrismaRepository();
	const serviceUpdateCard = new UpdateCard(
		cardRepository
	);


	return serviceUpdateCard;
}