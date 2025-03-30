import { Invoice, Prisma } from "@prisma/client";


export interface InvoiceDatabaseinterface{

    create(data: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>

    filterInvoices(userId: string, typeInvoice: string): Promise<Invoice[] | null>

    findInvoiceById(invoiceId: string): Promise<Invoice | null>
}