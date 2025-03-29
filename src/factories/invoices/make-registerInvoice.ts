import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { RegisterInvoice } from "@/services/invoices/registerInvoice";


export function makeRegisterInvoice(){

	const invoiceRepository = new InvoicePrismaRepository();
	const userRepository = new UserPrismaRepository();
    
	const serviceRegisterInvoice = new RegisterInvoice(
		userRepository,
		invoiceRepository
	);


	return serviceRegisterInvoice;
}