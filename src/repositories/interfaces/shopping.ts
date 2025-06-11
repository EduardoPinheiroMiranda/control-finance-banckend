import { ShoppingListByType } from "@/@types/prismaTypes";
import { Prisma, Shopping } from "@prisma/client";


export interface ShoppingDatabaseInterface{

    create(data: Prisma.ShoppingUncheckedCreateInput): Promise<Shopping>

    delete(shoppingId: string): Promise<Shopping>

    findFixedTypeOpenPurchases(userId: string): Promise<Prisma.ShoppingGetPayload<{
        include: {
            installment: true
        }
    }>[]>

    getAllShopping(userId: string, name: string | null, cursor: string | null): Promise<Shopping[]>

    getById(shoppingId: string): Promise<Shopping| null>

    getFullDataById(shoppingId: string): Promise<Prisma.ShoppingGetPayload<{
        include: {
            installment: true
        }
    }> | null>

    listAllOpenPurchases(userId: string): Promise<ShoppingListByType>

    payShopping(shoppingId: string[]): Promise<number>

    updateShopping(shoppingId: string, data: Prisma.ShoppingUncheckedUpdateInput): Promise<Shopping>

    updateTotalInstallments(shoppingIds: string[]): Promise<number>

}