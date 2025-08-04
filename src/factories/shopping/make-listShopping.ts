import { ShoppingPrismaRepository } from "oldCode/src/repositories/prisma/shopping";
import { ListShopping } from "oldCode/src/services/shopping/listShopping";


export function makeListShopping(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const serviceListShopping = new ListShopping(
		shoppingRepository
	);

	
	return serviceListShopping;
}