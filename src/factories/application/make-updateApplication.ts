import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { UpdateApplication } from "@/services/application/updateApplication";


export function makeUpdateApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceUpdateApplication = new UpdateApplication(
		applicationRepository
	);


	return serviceUpdateApplication;
}