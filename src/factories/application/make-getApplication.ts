import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { GetApplication } from "oldCode/src/services/application/getApplication";


export function makeGetApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceGetApplication = new GetApplication(
		applicationRepository
	);


	return serviceGetApplication;
}