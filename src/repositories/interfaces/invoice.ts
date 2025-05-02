import { Invoice, Prisma } from "@prisma/client";
import { Invoice as CustomTypeInvoice} from "@/@types/prismaTypes";


export interface InvoiceDatabaseInterface{

    create(data: Prisma.InvoiceUncheckedCreateInput[]): Promise<Invoice[]>

    findInvoicesFromDueDate(userId: string, dueDates: string[]): Promise<Invoice[]>

    findOpenInvoices(userId: string): Promise<Invoice[]>

    getAllInvoices(userId: string, currentInvoiceDueDate: Date ): Promise<CustomTypeInvoice[]>

    getCurrentInvoice(userId: string, dueDate: Date): Promise<CustomTypeInvoice[]>

    invoiceSearch(currentInvoiceDueDate: Date, where: string): Promise<CustomTypeInvoice[]>
}