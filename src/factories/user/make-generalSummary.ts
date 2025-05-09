import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GeneralSummary } from "@/services/user/generalSummary";


export function makeGeneralSummary(){

	const userRepository = new UserPrismaRepository();

	const serviceGeneralSummary = new GeneralSummary(
		userRepository
	);

	return serviceGeneralSummary;
}