import { Prisma } from "@prisma/client";
import { CategoryDatabaseInterface } from "../interfaces/category";
import { prisma } from "@/libs/primsa";


export class CategoryPrismaRepository implements CategoryDatabaseInterface{

	async create(data: Prisma.CategoryUncheckedCreateInput){
        
		const category = await prisma.category.create({data});
		return category;
	}

	async getAllCategories(cursor: string){
        
		const categories = await prisma.category.findMany({
			take: 20,
			skip: 1,
			cursor: {
				id: cursor
			},
			orderBy: {
				created_at: "asc"
			}
		});

		return categories;
	}
}