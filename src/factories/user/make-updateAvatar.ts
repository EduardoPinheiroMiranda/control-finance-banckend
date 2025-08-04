import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { UpdateAvatar } from "oldCode/src/services/user/updateAvatar";


export function makeUpdateAvatar(){

	const userRepository = new UserPrismaRepository();
	const serviceUpdateAvatar = new UpdateAvatar(
		userRepository
	);


	return serviceUpdateAvatar;
}