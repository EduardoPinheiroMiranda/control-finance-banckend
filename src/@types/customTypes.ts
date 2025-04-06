export interface User{
    name: string,
    email: string,
    password: string,
    limit: number,
    expired: number,
}

export interface Invoice{
    name: string,
    typeInvoice: string,
    paymentMethod: string,
    installmentValue: number,
    numberOfInstallments: number,
    expired: string,
    description: string,
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
    cardId: string | null
}