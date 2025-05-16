import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetCurrentInvoice } from "@/services/invoice/getCurrentInvoice";


export function makeGetAllCardInvoices(){

	const userRepository = new UserPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const serviceGetAllCardInvoices = new GetCurrentInvoice(
		userRepository,
		invoiceRepository
	);

    
	return serviceGetAllCardInvoices;
}