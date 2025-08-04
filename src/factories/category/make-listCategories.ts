import { CategoryPrismaRepository } from "oldCode/src/repositories/prisma/category";
import { ListCategories } from "oldCode/src/services/category/listCategories";


export function makeListCategories(){

	const categoryRepository = new CategoryPrismaRepository();
	const serviceListCategories = new ListCategories(
		categoryRepository
	);


	return serviceListCategories;
}