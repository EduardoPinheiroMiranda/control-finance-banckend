import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { UpdateUser } from "oldCode/src/services/user/updateUser";


export function makeUpdateUser(){

	const userRepository = new UserPrismaRepository();
	const serviceUpdateUser = new UpdateUser(
		userRepository
	);


	return serviceUpdateUser;
}