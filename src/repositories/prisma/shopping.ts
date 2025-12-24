import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/primsa";
import { DataToFind, ShoppingDatabaseInterface } from "../interfaces/shopping";


export class ShoppingPrismaRepository implements ShoppingDatabaseInterface{

	async create(data: Prisma.ShoppingUncheckedCreateInput){
		return await prisma.shopping.create({data});
	}

	async delete(shoppingId: string){
		return await prisma.shopping.delete({
			where: { id: shoppingId }
		});
	}

	async findFixedTypeOpenPurchases(userId: string){
		return await prisma.shopping.findMany({
			where: {
				userId: userId,
				pay: false,
				typeInvoice: "FIXED_EXPENSE"
			},
			include: { installment: true }
		});
	}

	async getAllShopping(data: DataToFind){
		return await prisma.shopping.findMany({
			take: 20,
			...(data.cursor && {
				skip: 1,
				cursor: {
					id: data.cursor
				}
			}),
			where:{
				userId: data.userId,
				...(data.name && {
					name: {
						contains: data.name,
						mode: "insensitive"
					}
				})
			},
			orderBy: { createdAt: "desc" }
		});
	}

	async getById(shoppingId: string){
		return await prisma.shopping.findUnique({
			where: { id: shoppingId },
		});
	}

	async getFullDataById(shoppingId: string){
		return await prisma.shopping.findUnique({
			where: { id: shoppingId },
			include: { installment: true }
		});
	}

	async listAllOpenPurchases(userId: string){
		
		const result = await prisma.$queryRaw<any[]>`
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
			where: { id: { in: shoppingId } },
			data: { pay: true }
		});

		return shopingPaid.count;
	}

	async updateShopping(shoppingId: string, data: Prisma.ShoppingUncheckedUpdateInput){
		return await prisma.shopping.update({
			where: { id: shoppingId },
			data
		});
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