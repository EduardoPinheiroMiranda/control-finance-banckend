import { ResourceNotFoud } from "@/errors/custonErros";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";


export class ListShopping{

	constructor(
        private shoppingRepository: ShoppingDatabaseInterface
	){}


	async execute(userId: string){

		const shoppingList = await this.shoppingRepository.listAllOpenPurchases(userId);

		if(shoppingList.extra_expense.length === 0 && shoppingList.fixed_expense.length === 0){
			throw new ResourceNotFoud("Compras não encontradas.");
		}

		return shoppingList;
	}
}