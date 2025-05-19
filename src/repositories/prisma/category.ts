import { Prisma } from "@prisma/client";
import { CategoryDatabaseInterface } from "../interfaces/category";
import { prisma } from "@/libs/primsa";


export class CategoryPrismaRepository implements CategoryDatabaseInterface{

	async createMany(data: Prisma.CategoryUncheckedCreateInput[]){

		const currentDate = new Date();

		const creteCategories = data.map((category, index) => {
			
			const createdAt = new Date(currentDate.setMilliseconds(index));
			return {
				name: category.name,
				created_at: createdAt,
				updated_at: createdAt
			};
		});
        
		const category = await prisma.category.createManyAndReturn({data: creteCategories});
		return category;
	}

	async getAllCategories(cursor: string | null){

		if(!cursor){
			const categories = await prisma.category.findMany({
				take: 20,
				orderBy: {
					created_at: "asc"
				}
			});
	
			return categories;
		}
        
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