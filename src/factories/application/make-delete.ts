import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { Delete } from "@/services/application/delete";


export function makeDelete(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceDelete = new Delete(
		applicationRepository
	);


	return serviceDelete;
}