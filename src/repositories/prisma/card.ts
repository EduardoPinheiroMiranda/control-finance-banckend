import { Prisma } from "@prisma/client";
import { CardDatabaseInterface } from "../interfaces/card";
import { prisma } from "@/libs/primsa";


export class CardPrismaRepository implements CardDatabaseInterface{

	async create(data: Prisma.CardUncheckedCreateInput){
        
		const card = await prisma.card.create({data});

		return card;
	}

	async disable(cardId: string){
		
		const disableCard = await prisma.card.update({
			where: {
				id: cardId,
				active: true
			},
			data:{
				active: false
			}
		});

		return disableCard;
	}

	async getAllCards(userId: string){

		const allCards = await prisma.card.findMany({
			where: {
				user_id: userId,
				active: true
			},
			orderBy: {
				created_at: "asc"
			}
		});

		return allCards;
	}

	async getById(cardId: string){
        
		const card = await prisma.card.findUnique({
			where: {
				id: cardId,
				active: true
			}
		});

		return card;
	}

	async updateCartd(cardId: string, data: Prisma.CardUncheckedUpdateInput){
		
		const card = await prisma.card.update({
			where: {
				id: cardId,
				active: true
			},
			data
		});

		return card;

	}
}