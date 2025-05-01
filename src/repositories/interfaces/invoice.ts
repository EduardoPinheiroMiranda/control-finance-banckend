import { InvoiceElements, ValueDetaisls } from "@/@types/prismaTypes";
import { Invoice, Prisma } from "@prisma/client";


export interface InvoiceDatabaseInterface{

    create(data: Prisma.InvoiceUncheckedCreateInput[]): Promise<Invoice[]>

    findInvoicesFromDueDate(userId: string, dueDates: string[]): Promise<Invoice[]>

    findOpenInvoices(userId: string): Promise<Invoice[]>

    getCurrentInvoice(userId: string, dueDate: Date): Promise<{
        fixedExpense: InvoiceElements[],
        extraExpense: InvoiceElements[]
    }>

    getValuesTheInvoice(userId: string, dueDate: Date): Promise<ValueDetaisls>
}