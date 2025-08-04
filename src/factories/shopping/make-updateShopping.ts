import { InstallmentPrismaRepository } from "oldCode/src/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "oldCode/src/repositories/prisma/shopping";
import { UpdateShopping } from "oldCode/src/services/shopping/updateShopping";


export function makeUpdateShopping(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const installmentRepository = new InstallmentPrismaRepository();
	const serviceUpdateShopping = new UpdateShopping(
		shoppingRepository,
		installmentRepository
	);

	
	return serviceUpdateShopping;
}