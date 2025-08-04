import { InvoicePrismaRepository } from "oldCode/src/repositories/prisma/invoice";
import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { GetCurrentInvoice } from "oldCode/src/services/invoice/getCurrentInvoice";


export function makeGetCurrentInvoice(){

	const userRepository = new UserPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const serviceGetCurrentInvoice = new GetCurrentInvoice(
		userRepository,
		invoiceRepository
	);

    
	return serviceGetCurrentInvoice;
}