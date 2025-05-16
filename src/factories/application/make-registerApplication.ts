import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { RegisterApplication } from "@/services/application/registerApplication";


export function makeRegisterApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceRegisterApplication = new RegisterApplication(
		applicationRepository
	);


	return serviceRegisterApplication;
}