import { Prisma } from "@/generated/prisma/client";
import { CategoryDatabaseInterface } from "../interfaces/category";
import { prisma } from "@/libs/primsa";


export class CategoryPrismaRepository implements CategoryDatabaseInterface{

	async createMany(data: Prisma.CategoryUncheckedCreateInput[]){

		const currentDate = new Date();

		const creteCategories = data.map((category, index) => {
			const createdAt = new Date(currentDate.setMilliseconds(index));
			return { name: category.name, createdAt: createdAt, updatedAt: createdAt };
		});
        
		return await prisma.category.createManyAndReturn({data: creteCategories});
	}

	async getAllCategories(cursor: string | null){

		if(!cursor){
			return await prisma.category.findMany({
				take: 20,
				orderBy: { createdAt: "asc" }
			});
		}
        
		return await prisma.category.findMany({
			take: 20,
			skip: 1,
			cursor: { id: cursor },
			orderBy: { createdAt: "asc" }
		});
	}
}