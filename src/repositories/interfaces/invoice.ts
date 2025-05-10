import { Invoice, Prisma } from "@prisma/client";
import { CardInvoice, Invoice as CustomTypeInvoice } from "@/@types/prismaTypes";


export interface InvoiceDatabaseInterface{

    create(data: Prisma.InvoiceUncheckedCreateInput[]): Promise<Invoice[]>

    findInvoicesFromDueDate(userId: string, dueDates: string[]): Promise<Invoice[]>

    findOpenInvoices(userId: string): Promise<Invoice[]>

    getAllCardInvoices(userId: string, cardId: string, dueDate: Date): Promise<CardInvoice[]>

    getAllInvoices(userId: string, currentInvoiceDueDate: Date ): Promise<CustomTypeInvoice[]>

    getById(invoiceId: string): Promise<Prisma.InvoiceGetPayload<{
        include: {
            installment: true
        }
    }> | null>

    getCurrentInvoice(userId: string, dueDate: Date): Promise<CustomTypeInvoice[]>

    invoiceSearch(currentInvoiceDueDate: Date, where: Prisma.Sql): Promise<CustomTypeInvoice[]>

    payInvoice(invoiceId: string): Promise<Invoice>
}