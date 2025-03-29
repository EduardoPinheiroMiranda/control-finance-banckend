import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ListInvoices } from "@/services/invoices/listInvoices";


export function makeListInvoices(){

	const invoiceRepository = new InvoicePrismaRepository();
	const serviceListeInvoice = new ListInvoices(
		invoiceRepository
	);

    
	return serviceListeInvoice;
}