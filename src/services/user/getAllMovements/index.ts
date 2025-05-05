import { ResourceNotFoud } from "@/errors/custonErros";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";


export class GetAllMovements{

	constructor(
        private shoppingRepository: ShoppingDatabaseInterface
	){}


	async execute(userId: string, name: string, cursor: string | null){

		const shopings = await this.shoppingRepository.getAllShopping(userId, name, cursor);

		if(shopings.length === 0){
			throw new ResourceNotFoud("Nenhuma compra foi encontrada.");
		}

		return shopings;
	}
}