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
    value: number,
    expired: string,
    description: string,
    numberOfInstallments: number,
    installmentsPaid: number
}