import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/primsa";
import { ShoppingDatabaseInterface } from "../interfaces/shopping";


export class ShoppingPrismaRepository implements ShoppingDatabaseInterface{

	async create(data: Prisma.ShoppingUncheckedCreateInput){
        
		const shoping = await prisma.shopping.create({data});

		return shoping;
	}
}