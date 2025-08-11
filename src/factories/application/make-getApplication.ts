import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { GetApplication } from "@/services/application/getApplication";


export function makeGetApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceGetApplication = new GetApplication(
		applicationRepository
	);


	return serviceGetApplication;
}