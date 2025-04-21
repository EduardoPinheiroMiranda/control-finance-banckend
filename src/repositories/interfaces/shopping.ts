import { Prisma, Shopping } from "@prisma/client";


export interface ShoppingDatabaseInterface{

    create(data: Prisma.ShoppingUncheckedCreateInput): Promise<Shopping>

    delete(shoppingId: string): Promise<Shopping>

    findFixedTypeOpenPurchases(userId: string): Promise<Prisma.ShoppingGetPayload<{
        include: {
            installment: true
        }
    }>[]>

    getById(shoppingId: string): Promise<Shopping| null>

    getFullDataById(shoppingId: string): Promise<Prisma.ShoppingGetPayload<{
        include: {
            installment: true
        }
    }> | null>

    updateShopping(shoppingId: string, data: Prisma.ShoppingUncheckedUpdateInput): Promise<Shopping>

    updateTotalInstallments(shoppingIds: string[], addedInstallments: number): Promise<number>

}