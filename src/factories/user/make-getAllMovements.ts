import { ShoppingPrismaRepository } from "oldCode/src/repositories/prisma/shopping";
import { GetAllMovements } from "oldCode/src/services/user/getAllMovements";


export function makeGetAllMovements(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const serviceGetAllMovements = new GetAllMovements(
		shoppingRepository
	);

    
	return serviceGetAllMovements;
}