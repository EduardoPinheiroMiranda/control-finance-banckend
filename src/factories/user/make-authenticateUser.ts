import { UserPrismaRepository } from "@/repositories/prisma/user";
import { AuthenticateUser } from "@/services/user/authenticateUser";


export function makeAuthenticateUser(){

	const userRepository = new UserPrismaRepository();
	const serviceRegisterUser = new AuthenticateUser(
		userRepository
	);

	return serviceRegisterUser;
}