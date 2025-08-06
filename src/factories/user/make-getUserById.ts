import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetUserById } from "@/services/user/getUserById";


export function makeGetUserById(){

	const userRepository = new UserPrismaRepository();
	const serviceGetUserById = new GetUserById(
		userRepository
	);


	return serviceGetUserById;
}