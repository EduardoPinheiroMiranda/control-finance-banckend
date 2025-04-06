import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ListInvoices } from "@/services/invoice/listInvoices";


export function makeListInvoices(){

	const invoiceRepository = new InvoicePrismaRepository();
	const serviceListeInvoice = new ListInvoices(
		invoiceRepository
	);

    
	return serviceListeInvoice;
}