import { CardPrismaRepository } from "@/repositories/prisma/card";
import { DisableCard } from "@/services/card/disableCard";


export function makeDisableCard(){

	const cardRepository = new CardPrismaRepository();
	const serviceDisableCard = new DisableCard(
		cardRepository
	);


	return serviceDisableCard;
}