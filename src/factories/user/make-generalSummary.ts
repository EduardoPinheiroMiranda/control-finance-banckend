import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { MovementPrismaRepository } from "@/repositories/prisma/movements";
import { GeneralSummary } from "@/services/user/generalSummary";


export function makeGeneralSummary(){

	const applicationRepository = new ApplicationPrismaRepository();
	const cardRepository = new CardPrismaRepository();
	const movementRepository = new MovementPrismaRepository();

	const serviceGeneralSummary = new GeneralSummary(
		applicationRepository,
		cardRepository,
		movementRepository
	);


	return serviceGeneralSummary;
}