import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetAllCardInvoices } from "@/services/invoice/getAllCardInvoices";


export function makeGetAllCardInvoices(){

	const userRepository = new UserPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const serviceGetAllCardInvoices = new GetAllCardInvoices(
		invoiceRepository,
		userRepository
	);

    
	return serviceGetAllCardInvoices;
}