import { CardPrismaRepository } from "oldCode/src/repositories/prisma/card";
import { InstallmentPrismaRepository } from "oldCode/src/repositories/prisma/installment";
import { InvoicePrismaRepository } from "oldCode/src/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "oldCode/src/repositories/prisma/shopping";
import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { RegisterShopping } from "oldCode/src/services/shopping/regitserShopping";

export function makeRegisterShopping(){

	const userRepository = new UserPrismaRepository();
	const shoppingRepository = new ShoppingPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const installmentRepository = new InstallmentPrismaRepository();
	const cardRepository = new CardPrismaRepository();
	const serviceRegisterShopping = new RegisterShopping(
		userRepository,
		shoppingRepository,
		invoiceRepository,
		installmentRepository,
		cardRepository
	);


	return serviceRegisterShopping;
}