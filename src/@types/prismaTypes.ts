import { Prisma, Shopping } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


interface Installment{
    installment_id: string,
    installment_number: number,
    installment_value: number,
    due_date: Date,
    pay: boolean,
    shopping_id: string,
    total_installments: number,
    type_invoice: string,
    payment_method: string,
    name: string,
    purchase_date: Date
}

export interface Invoice{
    invoice_id: string,
    pay: boolean,
    due_date: Date,
    closing_date: Date,
    current: boolean,
    amount: Decimal,
    limit: Decimal,
    available: Decimal,
    total_fixed_expense: Decimal,
    total_extra_expense: Decimal,
    total_invoice: Decimal,
    total_card: Decimal,
    total_money: Decimal,
    installments: {
        fixed_expense: Installment[],
        extra_expense: Installment[]
    }
}

export interface ShoppingListByType{
    fixed_expense: Shopping[],
    extra_expense: Shopping[]
}

export interface CardInvoice{
    invoice_id: string,
    pay: boolean,
    due_date: Date,
    current: boolean,
    amount: Decimal,
    installments: Installment[]
}

export type InstallmentWithTotalInstallments = Prisma.InstallmentGetPayload<{
    include: {
        shoppingId: {
            select: {
                total_installments: true
            }
        }
    }
}>

export interface InvoiceDetails{
    id: string,
    due_date: string,
    closing_date: string
    total_installments_on_invoice: number,
    installments_paid: number,
    installments_pending: number
}