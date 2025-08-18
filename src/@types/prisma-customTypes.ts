import { Prisma, Shopping } from "@/generated/prisma"
import { Decimal } from "@prisma/client/runtime/library"


export interface Installment{
    installmentId: string,
    installmentNumber: number,
    installmentValue: number,
    dueDate: string,
    pay: boolean,
    shoppingId: string,
    totalInstallments: number,
    typeInvoice: string,
    paymentMethod: string,
    name: string,
    purchaseDate: string
}

export interface Invoice{
    invoiceId: string,
    pay: boolean,
    dueDate: Date,
    closingDate: Date,
    current: boolean,
    amount: number,
    limit: number,
    available: number,
    totalFixedExpense: number,
    totalExtraExpense: number,
    totalInvoice: number,
    totalCard: number,
    totalMoney: number,
    installments: {
        fixedExpense: Installment[],
        extraExpense: Installment[]
    }
}


export interface ShoppingListByType{
    fixedExpense: {
        id: string,
        name: string,
        typeInvoice: string,
        paymentMethod: string,
        value: number,
        totalInstallments: number,
        pay: boolean,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        cardId: string | null,
        categoryId: string,
        userId: string
    }[],
    extraExpense: {
        id: string,
        name: string,
        typeInvoice: string,
        paymentMethod: string,
        value: number,
        totalInstallments: number,
        pay: boolean,
        description: null,
        createdAt: string,
        updatedAt: string,
        cardId: null,
        categoryId: string,
        userId: string
    }[]
}

export interface CardInvoice{
    invoiceId: string,
    pay: boolean,
    dueDate: Date,
    current: boolean,
    amount: Decimal,
    installments: Installment[]
}

export type InstallmentWithTotalInstallments = Prisma.InstallmentGetPayload<{
    include: {
        shopping: {
            select: {
                totalInstallments: true
            }
        }
    }
}>

export interface InvoiceDetails{
    id: string,
    dueDate: string,
    closingDate: string
    totalInstallmentsOnInvoice: number,
    installmentsPaid: number,
    installmentsPending: number
}

export interface ReturnTypeGetInvoiceCards{
    id: string,
    name: string,
    deuDay: number,
    amount: Decimal
}