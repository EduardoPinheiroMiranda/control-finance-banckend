import { InstallmentPrismaRepository } from "oldCode/src/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "oldCode/src/repositories/prisma/shopping";
import { DeleteShopping } from "oldCode/src/services/shopping/deleteShopping";


export function makeDeleteShopping(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const installmentRepository = new InstallmentPrismaRepository();
	const serviceDeleteShopping = new DeleteShopping(
		shoppingRepository,
		installmentRepository
	);

    
	return serviceDeleteShopping;
}