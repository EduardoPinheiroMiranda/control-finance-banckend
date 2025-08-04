import { CardPrismaRepository } from "oldCode/src/repositories/prisma/card";
import { DisableCard } from "oldCode/src/services/card/disableCard";


export function makeDisableCard(){

	const cardRepository = new CardPrismaRepository();
	const serviceDisableCard = new DisableCard(
		cardRepository
	);


	return serviceDisableCard;
}