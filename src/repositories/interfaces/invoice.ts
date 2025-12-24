import { Prisma, Invoice } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export type InvoiceWithInstallmente = Prisma.InvoiceGetPayload<{
    include: { installment: true }
}> 

export type InvoiceWithInstallmentePaid = Prisma.InvoiceGetPayload<{
    include: {
        installment: {
            select: { pay: true }
        }
    }
}>

export interface CardInvoice{
    invoiceId: string,
    pay: boolean,
    dueDate: Date,
    current: boolean,
    amount: Decimal,
    installments: Installment[]
}

export interface DetailedInvoice{
    invoiceId: string,
    pay: boolean,
    dueDate: Date,
    closingDate: Date,
    current: boolean,
    amount: Decimal,
    limit: Decimal,
    available: Decimal,
    totalFixedExpense: Decimal,
    totalExtraExpense: Decimal,
    totalInvoice: Decimal,
    totalCard: Decimal,
    totalMoney: Decimal,
    installments: {
        fixedExpense: Installment[],
        extraExpense: Installment[]
    }
}

export interface Installment{
    installmentId: string,
    installmentNumber: number,
    installmentValue: Decimal,
    dueDate: string,
    pay: boolean,
    shoppingId: string,
    totalInstallments: number,
    typeInvoice: string,
    paymentMethod: string,
    name: string,
    purchaseDate: string
}

export interface ReturnTypeGetInvoiceCards{
    id: string,
    name: string,
    deuDay: number,
    amount: Decimal
}

export interface InvoiceDetails{
    id: string,
    dueDate: string,
    closingDate: string
    totalInstallmentsOnInvoice: number,
    installmentsPaid: number,
    installmentsPending: number
}


export interface InvoiceDatabaseInterface{
 
    advanceInvoices(): Promise<InvoiceWithInstallmentePaid[]>

    create(data: Prisma.InvoiceUncheckedCreateInput[]): Promise<Invoice[]>

    findInvoicesFromDueDate(userId: string, dueDates: string[]): Promise<Invoice[]>

    findOpenInvoices(userId: string): Promise<Invoice[]>

    getAllCardInvoices(userId: string, cardId: string, dueDate: Date): Promise<CardInvoice[]>

    getAllInvoices(userId: string, currentInvoiceDueDate: Date ): Promise<DetailedInvoice[]>

    getById(invoiceId: string): Promise<InvoiceWithInstallmente| null>

    getCurrentInvoice(userId: string, dueDate: Date): Promise<DetailedInvoice[]>
    
    getInvoiceCards(invoiceId: string): Promise<ReturnTypeGetInvoiceCards[]>

    getInstallmentsByInvoice(invoiceId: string): Promise<Installment[]>

    invoiceDetails(invoiceId: string): Promise<InvoiceDetails[]>
    
    invoiceSearch(currentInvoiceDueDate: Date, where: Prisma.Sql, limit: Prisma.Sql): Promise<DetailedInvoice[]>

    payInvoice(invoiceId: string[]): Promise<Invoice[]>
}