import { Prisma } from "@/generated/prisma/client";
import { Installment, CardInvoice, Invoice as CustomTypeInvoice, InvoiceDetails, ReturnTypeGetInvoiceCards, Invoice } from "src/@types/prismaTypes";


export interface InvoiceDatabaseInterface{
 
    advanceInvoices(): Promise<Prisma.InvoiceGetPayload<{
        include: {
            installment: {
                select: {
                    pay: true
                }
            }
        }
    }>[]>

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
    
    getInvoiceCards(invoiceId: string): Promise<ReturnTypeGetInvoiceCards[]>

    getInstallmentsByInvoice(invoiceId: string): Promise<Installment[]>

    invoiceDetails(invoiceId: string): Promise<InvoiceDetails[]>
    
    invoiceSearch(currentInvoiceDueDate: Date, where: Prisma.Sql, limit: Prisma.Sql): Promise<CustomTypeInvoice[]>

    payInvoice(invoiceId: string[]): Promise<Invoice[]>
}