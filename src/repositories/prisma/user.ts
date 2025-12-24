import { prisma } from "@/libs/primsa";
import { DataToUpdateLimit, UserDatabaseInterface } from "../interfaces/user";
import { Prisma } from "@/generated/prisma/client";


export class UserPrismaRepository implements UserDatabaseInterface{

	async create(data: Prisma.UserCreateInput){
		return await prisma.user.create({data});
	}

	async findEmail(email: string){
		return prisma.user.findUnique({
			where: { email }
		});
	}

	async getById(userId: string){
		return await prisma.user.findUnique({
			where: { id: userId }
		});
	}

	async update(userId: string, data: Prisma.UserUncheckedUpdateInput){
		return await prisma.user.update({
			where: { id: userId },
			data
		});
	}

	async updateLimit(data: DataToUpdateLimit){
		return await prisma.user.update({
			where: { id: data.userId },
			data: {
				limit: data.limit,
				dueDay: data.dueDay,
				closingDay: data.closingDay
			}
		});
	}

	async updatePassword(userId: string, password: string){
		return await prisma.user.update({
			where: { id: userId },
			data: { password }
		});
	}
}