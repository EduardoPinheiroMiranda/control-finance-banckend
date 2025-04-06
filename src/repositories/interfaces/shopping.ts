import { Prisma, Shopping } from "@prisma/client";


export interface ShoppingDatabaseInterface{

    create(data: Prisma.ShoppingUncheckedCreateInput): Promise<Shopping>
}