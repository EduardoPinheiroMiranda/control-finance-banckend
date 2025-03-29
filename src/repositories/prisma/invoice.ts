import { Invoice, Prisma } from "@prisma/client";
import { InvoiceDatabaseinterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";


export class InvoicePrismaRepository implements InvoiceDatabaseinterface{

	async create(data: Prisma.InvoiceUncheckedCreateInput){
        
		const invoice = await prisma.invoice.create({data});

		return invoice;
	}

	async filterInvoices(userId: string, typeInvoice: string){
		

		let invoices: Invoice[] = [];

		if(typeInvoice === "all"){

			invoices = await prisma.invoice.findMany({
				where: { userId }
			});
		}else{
			invoices = await prisma.invoice.findMany({
				where: {
					userId,
					type_invoice: typeInvoice
				}
			});
		}
	
		if(invoices.length === 0){
			return null;
		}
		

		return invoices;
	}
}