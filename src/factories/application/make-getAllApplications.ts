import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { GetAllApplications } from "@/services/application/getAllApplications";


export function makeGetAllApplications(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceGetAllApplications = new GetAllApplications(
		applicationRepository
	);


	return serviceGetAllApplications;
}