import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { UpdatePassword } from "oldCode/src/services/user/updatePassword";


export function makeUpdatePassword(){

	const userRepository = new UserPrismaRepository();
	const serviceUpdatePassword = new UpdatePassword(
		userRepository
	);


	return serviceUpdatePassword;
}