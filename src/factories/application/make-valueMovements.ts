import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { ExtractPrismaRepository } from "@/repositories/prisma/extract";
import { ValueMovements } from "@/services/application/valueMovements";


export function makeValueMovements(){

	const applicationRepository = new ApplicationPrismaRepository();
	const extractRepository = new ExtractPrismaRepository();
	const serviceValueMovements = new ValueMovements(
		applicationRepository,
		extractRepository
	);


	return serviceValueMovements;
}