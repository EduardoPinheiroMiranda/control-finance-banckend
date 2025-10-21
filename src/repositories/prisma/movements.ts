import { prisma } from "@/libs/primsa";
import { MovementDatabaseInterfac } from "../interfaces/movement";
import { Prisma } from "@/generated/prisma/client";


export class MovementPrismaRepository implements MovementDatabaseInterfac{

	async create(data: Prisma.MovementUncheckedCreateInput){
        
		const movement = await prisma.movement.create({data});
		return movement;
	}

	async getMovements(userId: string, cursor: number){
        
		if(cursor === 0){

			const movements = await prisma.movement.findMany({
				take: 10,
				where: {
					userId
				},
				orderBy: {
					createdAt: "desc"
				}
			});

			return movements;
		}

		const movements = await prisma.movement.findMany({
			take: 10,
			skip: cursor,
			where: {
				userId
			},
			orderBy: {
				createdAt: "desc"
			}
		});

		return movements;
	}
}