import { UserPrismaRepository } from "@/repositories/prisma/user";
import { AuthenticateUser } from "@/services/user/authenticateUser";


export function makeAuthenticateUser(){

	const userRepository = new UserPrismaRepository();
	const serviceAuthenticateUser = new AuthenticateUser(
		userRepository
	);

	return serviceAuthenticateUser;
}