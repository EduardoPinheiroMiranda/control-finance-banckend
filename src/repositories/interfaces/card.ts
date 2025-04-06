import { Card, Prisma } from "@prisma/client";


export interface CardDatabaseInterface{
    
    create(data: Prisma.CardUncheckedCreateInput): Promise<Card>
}