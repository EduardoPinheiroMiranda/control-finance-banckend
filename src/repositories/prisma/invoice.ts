import { Prisma } from "@prisma/client";
import { InvoiceDatabaseinterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";


export class InvoicePrismaRepository implements InvoiceDatabaseinterface{

	async create(data: Prisma.InvoiceUncheckedCreateInput[]){
        
		const invoice = await prisma.invoice.createMany({data});

		return invoice.count;
	}

	async findInvoicesFromDueDate(userId: string, dueDates: string[]){
		
		const invoices = await prisma.invoice.findMany({
			where: {
				OR: dueDates.map((date) => {
					return { due_date: date, user_id: userId };
				})
			}
		});

		return invoices;
	}
}