import { Prisma, Shopping } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export type ShoppingWithInstallment = Prisma.ShoppingGetPayload<{
    include: {
        installment: true
    }
}>

export interface StructShopping {
    id: string,
    name: string,
    typeInvoice: string,
    paymentMethod: string,
    value: Decimal,
    totalInstallments: number,
    pay: boolean,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    cardId: string | null,
    categoryId: string,
    userId: string
}

export interface ShoppingListByType{
    fixedExpense: StructShopping[],
    extraExpense: StructShopping[]
}

export interface DataToFind {
    userId: string,
    name: string | null,
    cursor: string | null
}


export interface ShoppingDatabaseInterface{

    create(data: Prisma.ShoppingUncheckedCreateInput): Promise<Shopping>

    delete(shoppingId: string): Promise<Shopping>

    findFixedTypeOpenPurchases(userId: string): Promise<ShoppingWithInstallment[]>

    getAllShopping(data: DataToFind): Promise<Shopping[]>

    getById(shoppingId: string): Promise<Shopping| null>

    getFullDataById(shoppingId: string): Promise<ShoppingWithInstallment | null>

    listAllOpenPurchases(userId: string): Promise<ShoppingListByType>

    payShopping(shoppingId: string[]): Promise<number>

    updateShopping(shoppingId: string, data: Prisma.ShoppingUncheckedUpdateInput): Promise<Shopping>

    updateTotalInstallments(shoppingIds: string[]): Promise<number>

}