import { ResourceNotFoud } from "@/errors/custonErros";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";


export class GetAllMovements{

	constructor(
        private shoppingRepository: ShoppingDatabaseInterface
	){}


	async execute(userId: string, cursor: string | null){

		const shopings = await this.shoppingRepository.getAllShopping(userId, cursor);

		if(shopings.length === 0){
			throw new ResourceNotFoud("Nenhuma compra foi encontrada.");
		}

		return shopings;
	}
}