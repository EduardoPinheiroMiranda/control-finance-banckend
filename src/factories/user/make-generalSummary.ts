import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { CardPrismaRepository } from "oldCode/src/repositories/prisma/card";
import { ShoppingPrismaRepository } from "oldCode/src/repositories/prisma/shopping";
import { GeneralSummary } from "oldCode/src/services/user/generalSummary";


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