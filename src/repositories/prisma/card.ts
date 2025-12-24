import { Prisma } from "@/generated/prisma/client";
import { CardDatabaseInterface } from "../interfaces/card";
import { prisma } from "@/libs/primsa";


export class CardPrismaRepository implements CardDatabaseInterface{

	async create(data: Prisma.CardUncheckedCreateInput){
		return await prisma.card.create({data});
	}

	async disable(cardId: string){
		return await prisma.card.update({
			where: { id: cardId, active: true },
			data:{ active: false }
		});
	}

	async getAllCards(userId: string){
		return await prisma.card.findMany({
			where: { userId: userId, active: true },
			orderBy: { createdAt: "asc" }
		});
	}

	async getById(cardId: string){
		return await prisma.card.findUnique({
			where: { id: cardId, active: true }
		});
	}

	async updateCartd(cardId: string, data: Prisma.CardUncheckedUpdateInput){
		return await prisma.card.update({
			where: { id: cardId, active: true },
			data
		});
	}
}