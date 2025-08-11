import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { DeleteApplication } from "@/services/application/deleteApplication";


export function makeDeleteApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceDelete = new DeleteApplication(
		applicationRepository
	);


	return serviceDelete;
}