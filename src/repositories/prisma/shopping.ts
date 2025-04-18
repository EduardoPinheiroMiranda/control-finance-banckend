import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/primsa";
import { ShoppingDatabaseInterface } from "../interfaces/shopping";
import { typeInvoices } from "@/utils/globalValues";


export class ShoppingPrismaRepository implements ShoppingDatabaseInterface{

	async create(data: Prisma.ShoppingUncheckedCreateInput){
        
		const shoping = await prisma.shopping.create({data});

		return shoping;
	}

	async findFixedTypeOpenPurchases(userId: string){
		
		const shoppingList = await prisma.shopping.findMany({
			where: {
				user_id: userId,
				pay: false,
				type_invoice: typeInvoices[0] // fixed
			},
			include: {
				installment: true
			}
		});

		return shoppingList;
	}

	async getById(shoppingId: string){
		
		const shoping = await prisma.shopping.findUnique({
			where: {
				id: shoppingId
			}
		});

		return shoping;
	}

	async updateTotalInstallments(shoppingIds: string[], addedInstallments: number){

		const update = await prisma.shopping.updateMany({
			where: {
				id: { in: shoppingIds }
			},
			data: {
				total_installments: {
					increment: addedInstallments
				}
			}
		});


		return update.count;
	}

	async updateShopping(shoppingId: string, data: Prisma.ShoppingUncheckedUpdateInput){
		
		const shopping = await prisma.shopping.update({
			where: {
				id: shoppingId
			},
			data
		});

		return shopping;
	}
}