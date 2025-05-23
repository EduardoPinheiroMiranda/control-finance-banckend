import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetCurrentInvoice } from "@/services/invoice/getCurrentInvoice";


export function makeGetCurrentInvoice(){

	const userRepository = new UserPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const serviceGetCurrentInvoice = new GetCurrentInvoice(
		userRepository,
		invoiceRepository
	);

    
	return serviceGetCurrentInvoice;
}