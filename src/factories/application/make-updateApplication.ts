import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { UpdateApplication } from "oldCode/src/services/application/updateApplication";


export function makeUpdateApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceUpdateApplication = new UpdateApplication(
		applicationRepository
	);


	return serviceUpdateApplication;
}