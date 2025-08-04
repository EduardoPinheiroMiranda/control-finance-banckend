import { InvoicePrismaRepository } from "oldCode/src/repositories/prisma/invoice";
import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { GetAllInvoices } from "oldCode/src/services/invoice/getAllInvoices";


export function makeGetAllInvoices(){

	const userRepository = new UserPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const serviceGetAllInvoice = new GetAllInvoices(
		userRepository,
		invoiceRepository
	);

    
	return serviceGetAllInvoice;
}