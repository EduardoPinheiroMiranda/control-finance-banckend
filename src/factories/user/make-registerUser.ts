import { UserPrismaRepository } from "@/repositories/prisma/user";
import { RegisterUsers } from "@/services/user/registerUser";


export function makeRegisterUser(){

	const userRepository = new UserPrismaRepository();
	const serviceRegisterUser = new RegisterUsers(
		userRepository
	);


	return serviceRegisterUser;
}