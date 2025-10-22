import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { ExtractPrismaRepository } from "@/repositories/prisma/extract";
import { MovementPrismaRepository } from "@/repositories/prisma/movements";
import { ValueMovements } from "@/services/application/valueMovements";


export function makeValueMovements(){

	const applicationRepository = new ApplicationPrismaRepository();
	const extractRepository = new ExtractPrismaRepository();
	const movementReposiotry = new MovementPrismaRepository();
	const serviceValueMovements = new ValueMovements(
		applicationRepository,
		extractRepository,
		movementReposiotry
	);


	return serviceValueMovements;
}