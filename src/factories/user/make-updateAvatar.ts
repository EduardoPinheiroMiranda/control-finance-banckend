import { UserPrismaRepository } from "@/repositories/prisma/user";
import { UpdateAvatar } from "@/services/user/updateAvatar";


export function makeUpdateAvatar(){

	const userRepository = new UserPrismaRepository();
	const serviceUpdateAvatar = new UpdateAvatar(
		userRepository
	);


	return serviceUpdateAvatar;
}