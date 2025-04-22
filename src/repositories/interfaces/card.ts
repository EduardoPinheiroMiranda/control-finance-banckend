import { Card, Prisma } from "@prisma/client";


export interface CardDatabaseInterface{
    
    create(data: Prisma.CardUncheckedCreateInput): Promise<Card>

    disable(cardId: string): Promise<Card>

    getAllCards(userId: string): Promise<Card[]>

    getById(cardId: string): Promise<Card | null>

    updateCartd(cardId: string, data: Prisma.CardUncheckedUpdateInput): Promise<Card>
}