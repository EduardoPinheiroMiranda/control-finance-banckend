import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { DeleteShopping } from "@/services/shopping/deleteShopping";


export function makeDeleteShopping(){

	const shoppingRepository = new ShoppingPrismaRepository();
	const installmentRepository = new InstallmentPrismaRepository();

	const serviceDeleteShopping = new DeleteShopping(
		shoppingRepository,
		installmentRepository
	);

	return serviceDeleteShopping;
}