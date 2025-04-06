import { Invoice, Prisma } from "@prisma/client";


export interface InvoiceDatabaseinterface{

    create(data: Prisma.InvoiceUncheckedCreateInput[]): Promise<number>

    findInvoicesFromDueDate(userId: string, dueDates: string[]): Promise<Invoice[]>
}