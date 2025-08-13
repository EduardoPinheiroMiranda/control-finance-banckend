import { PaymentMethod, TypeExtract, TypeInvoice } from "@/generated/prisma/client"
import { Decimal } from "@/generated/prisma/runtime/library"


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
    typeInvoice: keyof typeof TypeInvoice,
    paymentMethod: keyof typeof PaymentMethod,
    value: number,
    totalInstallments: number,
    description: string | null,
    dueDay: number | null,
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
    dueDate: Date,
	closingDate: Date,
    userId: string
}

export interface Installment{
    installmentNumber: number,
    installmentValue: Decimal,
    dueDate: Date,
    shoppingId: string,
    invoiceId: string,
}

export interface Dates{
	dueDate: Date,
	closingDate: Date
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
    colorFont: string | null,
    colorCard: string | null,
}

export interface Application{
    name: string,
    targetValue: number,
    institution: string | null,
    colorFont: string | null,
    colorApplication: string | null,
    icon: string
}


export interface Filter{
    date: string | null,
    applicationId: string | null,
    type: TypeExtract
}
