import { Prisma, Card } from "@prisma/client";
import { CardDatabaseInterface } from "../interfaces/card";
import { prisma } from "@/libs/primsa";


export class CardPrismaRepository implements CardDatabaseInterface{

	async create(data: Prisma.CardUncheckedCreateInput): Promise<Card> {
        
		const card = await prisma.card.create({data});

		return card;
	}

	async getById(cardId: string){
        
		const card = await prisma.card.findUnique({
			where: {
				id: cardId
			}
		});

		return card;
	}
}