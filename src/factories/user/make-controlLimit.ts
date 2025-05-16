import { UserPrismaRepository } from "@/repositories/prisma/user";
import { ControlLimit } from "@/services/user/controlLimit";


export function makeControlLimit(){

	const userRepository = new UserPrismaRepository();
	const serviceControlLimit = new ControlLimit(
		userRepository
	);

	return serviceControlLimit;
}