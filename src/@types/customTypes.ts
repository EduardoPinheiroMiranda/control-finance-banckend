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

export interface ShoppingUpdate{
    id: string,
    name: string,
    value: number,
    description: string | null,
    dueDay: number,
    categoryId: string,
}

export interface Invoice{
    due_date: Date,
	closing_date: Date,
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

export interface Card{
    name: string,
    dueDay: number,
    closingDay: number,
    colorFont: string | null,
    colorCard: string | null,
}

export interface CardUpdate{
    id: string
    name: string,
    dueDay: number,
    closingDay: number,
    colorFont: string,
    colorCard: string,
}

export interface Application{
    name: string | null,
    targetValue: number,
    institution: string,
    colorFont: string | null,
    colorApplication: string | null,
    icon: string
}