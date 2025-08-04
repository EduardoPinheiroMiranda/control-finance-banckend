import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { GetUserById } from "oldCode/src/services/user/getUserById";


export function makeGetUserById(){

	const userRepository = new UserPrismaRepository();
	const serviceGetUserById = new GetUserById(
		userRepository
	);


	return serviceGetUserById;
}