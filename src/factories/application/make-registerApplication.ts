import { ApplicationPrismaRepository } from "oldCode/src/repositories/prisma/application";
import { RegisterApplication } from "oldCode/src/services/application/registerApplication";


export function makeRegisterApplication(){

	const applicationRepository = new ApplicationPrismaRepository();
	const serviceRegisterApplication = new RegisterApplication(
		applicationRepository
	);


	return serviceRegisterApplication;
}