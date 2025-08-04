import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { RegisterUsers } from "oldCode/src/services/user/registerUser";


export function makeRegisterUser(){

	const userRepository = new UserPrismaRepository();
	const serviceRegisterUser = new RegisterUsers(
		userRepository
	);


	return serviceRegisterUser;
}