import { UserPrismaRepository } from "@/repositories/prisma/user";
import { UpdatePassword } from "@/services/user/updatePassword";



export function makeUpdatePassword(){

	const userRepository = new UserPrismaRepository();
	const serviceUpdatePassword = new UpdatePassword(
		userRepository
	);


	return serviceUpdatePassword;
}