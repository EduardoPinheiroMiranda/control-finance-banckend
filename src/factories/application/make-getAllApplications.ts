import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { GetAllApplications } from "oldCode/src/services/application/getAllApplications";


export function makeGetAllApplications(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceGetAllApplications = new GetAllApplications(
		applicationRepository
	);


	return serviceGetAllApplications;
}