import { Decimal } from "@prisma/client/runtime/library";


export interface User{
    name: string,
    email: string,
    password: string,
    limit: number,
    dueDay: number,
    closeDay: number
}

export interface Shopping{
    name: string,
    typeInvoice: string,
    paymentMethod: string,
    value: number,
    totalInstallments: number,
    description: string | null,
    dueDay: number,
    categoryId: string,
    cardId: string | null,
    purchaseDate: string | null
}

export interface Invoice{
    due_date: Date,
	close_date: Date,
    user_id: string
}

export interface Installment{
    installment_number: number,
    installment_value: Decimal,
    due_date: Date,
    shopping_id: string,
    invoice_id: string,
}

export interface Dates{
	dueDate: Date,
	closeDate: Date
}