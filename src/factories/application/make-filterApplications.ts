import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { FilterApplications } from "@/services/application/filterApplications";


export function makeFilterApplications(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceFilterApplications = new FilterApplications(
		applicationRepository
	);


	return serviceFilterApplications;
}