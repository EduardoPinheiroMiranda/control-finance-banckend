import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { ListShopping } from "@/services/shopping/listShopping";


export function makeListShopping(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const serviceListShopping = new ListShopping(
		shoppingRepository
	);

	
	return serviceListShopping;
}