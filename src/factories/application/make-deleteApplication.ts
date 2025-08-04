import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { DeleteApplication } from "oldCode/src/services/application/deleteApplication";


export function makeDeleteApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceDelete = new DeleteApplication(
		applicationRepository
	);


	return serviceDelete;
}