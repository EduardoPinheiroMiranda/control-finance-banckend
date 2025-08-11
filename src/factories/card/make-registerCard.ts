import { CardPrismaRepository } from "@/repositories/prisma/card";
import { RegisterCard } from "@/services/card/registerCard";


export function makeRegisterCard(){

	const cardRepository = new CardPrismaRepository();
	const serviceRegisterCard = new RegisterCard(
		cardRepository
	);


	return serviceRegisterCard;
}