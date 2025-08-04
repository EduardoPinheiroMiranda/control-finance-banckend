import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { FilterApplications } from "oldCode/src/services/application/filterApplications";


export function makeFilterApplications(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceFilterApplications = new FilterApplications(
		applicationRepository
	);


	return serviceFilterApplications;
}