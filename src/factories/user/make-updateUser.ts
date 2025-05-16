import { UserPrismaRepository } from "@/repositories/prisma/user";
import { UpdateUser } from "@/services/user/updateUser";



export function makeUpdateUser(){

	const userRepository = new UserPrismaRepository();
	const serviceUpdateUser = new UpdateUser(
		userRepository
	);


	return serviceUpdateUser;
}