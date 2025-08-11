import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetAllInvoices } from "@/services/invoice/getAllInvoices";


export function makeGetAllInvoices(){

	const userRepository = new UserPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const serviceGetAllInvoice = new GetAllInvoices(
		userRepository,
		invoiceRepository
	);

    
	return serviceGetAllInvoice;
}