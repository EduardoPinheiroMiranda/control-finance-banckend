import { CardPrismaRepository } from "oldCode/src/repositories/prisma/card";
import { RegisterCard } from "oldCode/src/services/card/registerCard";


export function makeRegisterCard(){

	const cardRepository = new CardPrismaRepository();
	const serviceRegisterCard = new RegisterCard(
		cardRepository
	);


	return serviceRegisterCard;
}