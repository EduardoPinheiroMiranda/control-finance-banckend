import { prisma } from "@/libs/primsa";
import { UserDatabaseInterface } from "../interfaces/user";
import { Prisma } from "@prisma/client";


export class UserPrismaRepository implements UserDatabaseInterface{

	async create(data: Prisma.UserCreateInput){
		const user = await prisma.user.create({data});
	    return user;
	}
}