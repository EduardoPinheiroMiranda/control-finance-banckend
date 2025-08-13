import { Prisma, Shopping } from "@/generated/prisma/client";
import { prisma } from "@/libs/primsa";
import { ShoppingDatabaseInterface } from "../interfaces/shopping";
import { ShoppingListByType } from "@/@types/prisma-customTypes";


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
				userId: userId,
				pay: false,
				typeInvoice: "FIXED_EXPENSE"
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
				userId: userId,
				...(name && {
					name: {
						contains: name,
						mode: "insensitive"
					}
				})
			},
			orderBy: {
				createdAt: "desc"
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
					'fixedExpense', coalesce(
						json_agg( 
							json_build_object(
								'id', shopping.id,
								'name', shopping.name,
								'typeInvoice', shopping.type_invoice,
								'paymentMethod', shopping.payment_method,
								'value', shopping.value,
								'totalInstallments', shopping.total_installments,
								'pay', shopping.pay,
								'description', shopping.description,
								'createdAt', shopping.created_at,
								'updatedAt', shopping.updated_at,
								'cardId', shopping.card_id,
								'categoryId', shopping.category_id,
								'userId', shopping.user_id
							) order by shopping.created_at desc
						)filter (where shopping.type_invoice = 'FIXED_EXPENSE'),
					'[]'::json
					),
				
					'extraExpense', coalesce(
						json_agg(
							json_build_object(
								'id', shopping.id,
								'name', shopping.name,
								'typeInvoice', shopping.type_invoice,
								'paymentMethod', shopping.payment_method,
								'value', shopping.value,
								'totalInstallments', shopping.total_installments,
								'pay', shopping.pay,
								'description', shopping.description,
								'createdAt', shopping.created_at,
								'updatedAt', shopping.updated_at,
								'cardId', shopping.card_id,
								'categoryId', shopping.category_id,
								'userId', shopping.user_id
							) order by shopping.created_at desc
						)filter (where shopping.type_invoice = 'EXTRA_EXPENSE'),
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
				typeInvoice: "FIXED_EXPENSE"
			},
			data: {
				totalInstallments: {
					increment: 1
				}
			}
		});


		return update.count;
	}
}