import { ResourceNotFound } from "@/errors/custonErros";
import { CategoryDatabaseInterface } from "@/repositories/interfaces/category";


export class ListCategories{

	constructor(
        private categoryRepository: CategoryDatabaseInterface
	){}


	async execute(categoryId: string | null){

		const categories = await this.categoryRepository.getAllCategories(categoryId);

		if(categories.length === 0){
			throw new ResourceNotFound("Não foi encontrada nenhuma categoria ainda.");
		}

		return categories;
	}
}