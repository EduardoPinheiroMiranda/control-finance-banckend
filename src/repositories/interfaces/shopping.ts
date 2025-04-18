import { Prisma, Shopping } from "@prisma/client";


export interface ShoppingDatabaseInterface{

    create(data: Prisma.ShoppingUncheckedCreateInput): Promise<Shopping>

    findFixedTypeOpenPurchases(userId: string): Promise<Prisma.ShoppingGetPayload<{
        include: {
            installment: true
        }
    }>[]>

    updateTotalInstallments(shoppingIds: string[], addedInstallments: number): Promise<number>
}