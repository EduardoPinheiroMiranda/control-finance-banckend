import { Shopping } from "@prisma/client";


interface Installment{
    installment_id: string,
    installment_number: number,
    installment_value: number,
    due_date: Date,
    shopping_id: string,
    total_installments: number,
    type_invoice: string,
    payment_method: string,
    name: string
}

export interface Invoice{
    invoice_id: string,
    pay: boolean,
    due_date: Date,
    closing_date: Date,
    current: boolean,
    amount: number,
    total_fixed_expense: number,
    total_extra_expense: number,
    total_invoice: number,
    total_card: number,
    total_money: number,
    installments: {
        fixedExpense: Installment[],
        extraExpense: Installment[]
    }
}

export interface ShoppingListByType{
    fixedExpense: Shopping[],
    extraExpense: Shopping[]
}

export interface CardInvoice{
    invoice_id: string,
    pay: string,
    due_date: Date,
    current: boolean,
    amount: number,
    installments: Installment[]
}