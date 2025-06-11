import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/primsa";
import { ShoppingDatabaseInterface } from "../interfaces/shopping";
import { typeInvoices } from "@/utils/globalValues";
import { ShoppingListByType } from "@/@types/prismaTypes";


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

	async getAllShopping(userId: string, name: string | null, cursor: string | null){

		const shoppings = await prisma.shopping.findMany({
			take: 20,
			...(cursor && {
				skip: 1,
				cursor: {
					id: cursor
				}
			}),
			where:{
				user_id: userId,
				...(name && {
					name: {
						contains: name,
						mode: "insensitive"
					}
				})
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

	async listAllOpenPurchases(userId: string){
		
		const shoppings = await prisma.$queryRaw<{
			shopping: ShoppingListByType
		}[]>`
			select
				json_build_object(
					'fixed_expense', coalesce(
						json_agg( 
							shopping.* order by shopping.created_at desc
						)filter (where shopping.type_invoice = 'fixedExpense'),
					'[]'::json
					),
				
					'extra_expense', coalesce(
						json_agg(
							shopping.* order by shopping.created_at desc
						)filter (where shopping.type_invoice = 'extraExpense'),
						'[]'::json
					)
			) as shopping
			from
				shopping
			where
				shopping.user_id = ${userId} and shopping.pay = false
		`;

		return shoppings[0].shopping;
	}

	async payShopping(shoppingId: string[]){
		
		const shopingPaid = await prisma.shopping.updateMany({
			where: {
				id: { in: shoppingId }
			},
			data: {
				pay: true
			}
		});


		return shopingPaid.count;
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

	async updateTotalInstallments(shoppingIds: string[]){

		const update = await prisma.shopping.updateMany({
			where: {
				id: { in: shoppingIds },
				type_invoice: typeInvoices[0]
			},
			data: {
				total_installments: {
					increment: 1
				}
			}
		});


		return update.count;
	}
}