import { InvoicePrismaRepository } from "oldCode/src/repositories/prisma/invoice";
import { UserPrismaRepository } from "oldCode/src/repositories/prisma/user";
import { GetAllCardInvoices } from "oldCode/src/services/invoice/getAllCardInvoices";


export function makeGetAllCardInvoices(){

	const userRepository = new UserPrismaRepository();
	const invoiceRepository = new InvoicePrismaRepository();
	const serviceGetAllCardInvoices = new GetAllCardInvoices(
		invoiceRepository,
		userRepository
	);

    
	return serviceGetAllCardInvoices;
}