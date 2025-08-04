import { InstallmentPrismaRepository } from "oldCode/src/repositories/prisma/installment";
import { InvoicePrismaRepository } from "oldCode/src/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "oldCode/src/repositories/prisma/shopping";
import { PayInvoice } from "oldCode/src/services/invoice/payInvoice";


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