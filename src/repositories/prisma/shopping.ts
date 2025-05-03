import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/primsa";
import { ShoppingDatabaseInterface } from "../interfaces/shopping";
import { typeInvoices } from "@/utils/globalValues";


export class ShoppingPrismaRepository implements ShoppingDatabaseInterface{

	async create(data: Prisma.ShoppingUncheckedCreateInput){
        
		const shoping = await prisma.shopping.create({data});

		return shoping;
	}

	async delete(shoppingId: string){
		
		const installment = await prisma.shopping.delete({
			where: {
				id: shoppingId
			}
		});

		return installment;
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

	async getAllShopping(userId: string, cursor: string | null){

		if(!cursor){
			const shoppings = await prisma.shopping.findMany({
				take: 20,
				where:{
					user_id: userId
				},
				orderBy: {
					created_at: "desc"
				}
			});

			return shoppings;
		}


		const shoppings = await prisma.shopping.findMany({
			take: 20,
			skip: 1,
			cursor: {
				id: cursor
			},
			where:{
				user_id: userId
			},
			orderBy: {
				created_at: "desc"
			}
		});

		return shoppings;
	}

	async getById(shoppingId: string){

		const shoping = await prisma.shopping.findUnique({
			where: {
				id: shoppingId
			},
		});

		return shoping;
	}

	async getFullDataById(shoppingId: string){
		
		const shoping = await prisma.shopping.findUnique({
			where: {
				id: shoppingId
			},
			include: {
				installment: true
			}
		});

		return shoping;
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
}