import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { AuthenticateUser } from "oldCode/src/services/user/authenticateUser";


export function makeAuthenticateUser(){

	const userRepository = new UserPrismaRepository();
	const serviceAuthenticateUser = new AuthenticateUser(
		userRepository
	);

	
	return serviceAuthenticateUser;
}