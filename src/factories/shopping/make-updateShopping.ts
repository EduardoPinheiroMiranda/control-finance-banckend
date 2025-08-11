import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { UpdateShopping } from "@/services/shopping/updateShopping";


export function makeUpdateShopping(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const installmentRepository = new InstallmentPrismaRepository();
	const serviceUpdateShopping = new UpdateShopping(
		shoppingRepository,
		installmentRepository
	);

	
	return serviceUpdateShopping;
}