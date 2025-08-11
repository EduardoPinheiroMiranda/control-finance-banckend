import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { PayInvoice } from "@/services/invoice/payInvoice";


export function makePayInvoice(){

	const invoiceRepository = new InvoicePrismaRepository();
	const installmentRepository = new InstallmentPrismaRepository();
	const shoppingRepository = new ShoppingPrismaRepository();
	const servicePayInvoice = new PayInvoice(
		invoiceRepository,
		installmentRepository,
		shoppingRepository
	);

    
	return servicePayInvoice;
}