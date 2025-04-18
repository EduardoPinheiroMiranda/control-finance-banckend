import { Prisma, Shopping } from "@prisma/client";


export interface ShoppingDatabaseInterface{

    create(data: Prisma.ShoppingUncheckedCreateInput): Promise<Shopping>

    findFixedTypeOpenPurchases(userId: string): Promise<Prisma.ShoppingGetPayload<{
        include: {
            installment: true
        }
    }>[]>

    getById(shoppingId: string): Promise<Shopping | null>

    updateTotalInstallments(shoppingIds: string[], addedInstallments: number): Promise<number>

    updateShopping(shoppingId: string, data: Prisma.ShoppingUncheckedUpdateInput): Promise<Shopping>
}