import { CardPrismaRepository } from "@/repositories/prisma/card";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { RegisterShopping } from "@/services/shopping/regitserShopping";

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