import { Prisma } from "@prisma/client";
import { InvoiceDatabaseinterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";


export class InvoicePrismaRepository implements InvoiceDatabaseinterface{

	async create(data: Prisma.InvoiceUncheckedCreateInput){
        
		const invoice = await prisma.invoice.create({data});

		return invoice;
	}
}