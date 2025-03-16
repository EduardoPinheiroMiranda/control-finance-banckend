import { prisma } from "@/libs/primsa";
import { UserDatabaseInterface } from "../interfaces/user";
import { Prisma } from "@prisma/client";


export class UserPrismaRepository implements UserDatabaseInterface{

	async create(data: Prisma.UserCreateInput){
		const user = await prisma.user.create({data});
	    return user;
	}

	async findEmail(email: string){
		
		const user = prisma.user.findUnique({
			where: {
				email
			}
		});

		return user;

	}

	async getById(userId: string){
		
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		return user;
	}
}