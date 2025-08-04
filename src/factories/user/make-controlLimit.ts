import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { ControlLimit } from "oldCode/src/services/user/controlLimit";


export function makeControlLimit(){

	const userRepository = new UserPrismaRepository();
	const serviceControlLimit = new ControlLimit(
		userRepository
	);

    
	return serviceControlLimit;
}