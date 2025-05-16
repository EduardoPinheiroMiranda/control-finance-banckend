import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { GeneralSummary } from "@/services/user/generalSummary";


export function makeGeneralSummary(){

	const applicationRepository = new ApplicationPrismaRepository();
	const cardRepository = new CardPrismaRepository();
	const shoppingRepository = new ShoppingPrismaRepository();

	const serviceGeneralSummary = new GeneralSummary(
		applicationRepository,
		cardRepository,
		shoppingRepository
	);

	return serviceGeneralSummary;
}