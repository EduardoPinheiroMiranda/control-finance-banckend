import { Invoice, Prisma } from "@prisma/client";


export interface InvoiceDatabaseinterface{

    create(data: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>

    

}