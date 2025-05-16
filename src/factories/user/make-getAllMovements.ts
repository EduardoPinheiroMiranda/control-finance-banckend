import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { GetAllMovements } from "@/services/user/getAllMovements";


export function makeGetAllMovements(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const serviceGetAllMovements = new GetAllMovements(
		shoppingRepository
	);

	return serviceGetAllMovements;
}