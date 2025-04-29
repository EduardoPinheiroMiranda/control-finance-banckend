import { Invoice, Prisma } from "@prisma/client";


export interface InvoiceDatabaseInterface{

    create(data: Prisma.InvoiceUncheckedCreateInput[]): Promise<Invoice[]>

    findInvoicesFromDueDate(userId: string, dueDates: string[]): Promise<Invoice[]>

    findOpenInvoices(userId: string): Promise<Invoice[]>

    getCurrentInvoice(userId: string, dueDate: Date): Promise<Invoice>

}