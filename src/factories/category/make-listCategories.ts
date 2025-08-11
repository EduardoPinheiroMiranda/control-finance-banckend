import { CategoryPrismaRepository } from "@/repositories/prisma/category";
import { ListCategories } from "@/services/category/listCategories";


export function makeListCategories(){

	const categoryRepository = new CategoryPrismaRepository();
	const serviceListCategories = new ListCategories(
		categoryRepository
	);


	return serviceListCategories;
}