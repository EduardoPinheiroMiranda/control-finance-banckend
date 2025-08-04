import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { ExtractPrismaRepository } from "oldCode/src/repositories/prisma/extract";
import { ValueMovements } from "oldCode/src/services/application/valueMovements";


export function makeValueMovements(){

	const applicationRepository = new ApplicationPrismaRepository();
	const extractRepository = new ExtractPrismaRepository();
	const serviceValueMovements = new ValueMovements(
		applicationRepository,
		extractRepository
	);


	return serviceValueMovements;
}