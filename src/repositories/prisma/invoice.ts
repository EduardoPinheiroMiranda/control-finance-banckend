import { CardInvoice, DetailedInvoice, Installment, InvoiceDatabaseInterface, InvoiceDetails, ReturnTypeGetInvoiceCards } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";
import { Prisma } from "@/generated/prisma/client";


export class InvoicePrismaRepository implements InvoiceDatabaseInterface{

	async advanceInvoices(){
		return await prisma.invoice.findMany({
			where: {
				pay: false,
				closingDate: { lte: new Date() }
			},
			include: {
				installment: {
					select: { pay: true }
				}
			},
			take: 100
		});
	}

	async create(data: Prisma.InvoiceUncheckedCreateInput[]){
		return await prisma.invoice.createManyAndReturn({data});
	}

	async findInvoicesFromDueDate(userId: string, dueDates: string[]){
		return await prisma.invoice.findMany({
			where: { OR: dueDates.map((date) => {
				return { dueDate: date, userId: userId };
			})}
		});
	}

	async findOpenInvoices(userId: string){
		return await prisma.invoice.findMany({
			where:{ userId: userId, pay: false, },
			orderBy: { dueDate: "asc" }
		});
	}

	async getAllCardInvoices(userId: string, cardId: string, dueDate: Date){
		
		const result = await prisma.$queryRaw<any[]>`
			select
				invoices.id as invoice_id,
				invoices.pay,
				invoices.due_date,
				case when invoices.due_date = ${dueDate} then true else false end as "current",
				sum(installments.installment_value) as amount,
				json_agg(
					json_build_object(
						'installmentId', installments.id,
						'installmentNumber', installments.installment_number,
						'installmentValue', installments.installment_value,
						'dueDate', installments.due_date,
						'pay', installments.pay,
						'shoppingId', installments.shopping_id,
						'totalInstallments', shopping.total_installments,
						'typeInvoice', shopping.type_invoice,
						'paymentMethod', shopping.payment_method,
						'name', shopping.name,
						'purchaseDate', shopping.created_at
					)
					order by installments.created_at desc
				) as installments
			from
				invoices
				inner join installments on installments.invoice_id = invoices.id
				inner join shopping on shopping.id = installments.shopping_id
			where 
				invoices.user_id = ${userId} and shopping.card_id = ${cardId}
			group by invoices.id, invoices.due_date
			order by invoices.due_date;
		`;


		const invoices: CardInvoice[] = result.map((invoice) => {
			return {
				invoiceId: invoice.invoice_id,
				pay: invoice.pay,
				dueDate: invoice.due_date,
				current: invoice.current,
				amount: Prisma.Decimal(invoice.amount),
				installments: invoice.installments.map((installment: any) => {
					return{
						installmentId: installment.id,
						installmentNumber: installment.installment_number,
						installmentValue: Prisma.Decimal(installment.installment_value),
						dueDate: installment.due_date,
						pay: installment.pay,
						shoppingId: installment.shopping_id,
						totalInstallments: installment.total_installments,
						typeInvoice: installment.type_invoice,
						paymentMethod: installment.payment_method,
						name: installment.name,
						purchaseDate: installment.created_at
					};
				})
			};
		});

		return invoices;
	}

	async getAllInvoices(userId: string, currentInvoiceDueDate: Date){
		const where = Prisma.sql`invoices.user_id = ${userId}`;
		const limit = Prisma.sql``;
		return await this.invoiceSearch(currentInvoiceDueDate, where, limit);
	}

	async getById(invoiceId: string){
		return await prisma.invoice.findUnique({
			where: { id: invoiceId },
			include: { installment: true }
		});
	}

	async getCurrentInvoice(userId: string, dueDate: Date){

		const where = Prisma.sql`
			(
				invoices.due_date = ${dueDate} and
				invoices.pay = false and
				invoices.user_id = ${userId}
			)
			OR
			(
				invoices.due_date > ${dueDate} and
				invoices.pay = false and
				invoices.user_id = ${userId}
			)
		`;
		const limit = Prisma.sql`limit 1`;
		return await this.invoiceSearch(dueDate, where, limit);
	}

	async getInstallmentsByInvoice(invoiceId: string){
		
		const result = await prisma.$queryRaw<any[]>`
			select
				installments.id as installment_id,
				installments.installment_number,
				installments.installment_value,
				installments.due_date,
				installments.pay,
				installments.shopping_id,
				shopping.total_installments,
				shopping.type_invoice,
				shopping.payment_method,
				shopping.name,
				shopping.created_at
			from
				invoices
				inner join installments on installments.invoice_id = invoices.id
				inner join shopping on shopping.id = installments.shopping_id
			where
				invoices.id = ${invoiceId}
		`;

		const installments: Installment[] = result.map((installment) => {
			return{
				installmentId: installment.installment_id,
				installmentNumber: Number(installment.installment_number),
				installmentValue: Prisma.Decimal(installment.installment_value),
				dueDate: installment.due_date,
				pay: installment.pay,
				shoppingId: installment.shopping_id,
				totalInstallments: Number(installment.total_installments),
				typeInvoice: installment.type_invoice,
				paymentMethod: installment.payment_method,
				name: installment.name,
				purchaseDate: installment.created_at
			};
		});

		return installments;
	}

	async getInvoiceCards(invoiceId: string){
		
		const result = await prisma.$queryRaw<any[]>`
			select
				cards.id,
				cards.name,
				cards.due_day,
				sum(case when installments.pay = false then installments.installment_value else 0 end) as amount
			from
				invoices
				INNER JOIN installments ON installments.invoice_id = invoices.id
				INNER JOIN shopping ON shopping.id = installments.shopping_id
				INNER JOIN cards ON cards.id = shopping.card_id
			where
				invoices.id = ${invoiceId} 
			group by cards.id
		`;

		const cards: ReturnTypeGetInvoiceCards[] = result.map((card) => {
			return{
				id: card.id,
				name: card.name,
				deuDay: card.due_day,
				amount: Prisma.Decimal(card.amount)
			};
		});

		return cards;
	}

	async invoiceDetails(invoiceId: string){
		
		const result = await prisma.$queryRaw<any[]>`
			select
				invoices.id,
				invoices.due_date,
				invoices.closing_date,
				count(installments.pay) as total_installments_on_invoice,
				sum(case when installments.pay = true then 1 else 0 end) as installments_paid,
				sum(case when installments.pay = false then 1 else 0 end) as installments_pending
			from
				installments inner join invoices on installments.invoice_id = invoices.id
			where
				invoices.id = ${invoiceId}
			group by 
				invoices.id, invoices.due_date
			order by 
				invoices.due_date;
		`;


		const details: InvoiceDetails[] = result.map((invoice) => {
			return {
				id: invoice.id,
				dueDate: invoice.due_date,
				closingDate: invoice.closing_date,
				totalInstallmentsOnInvoice: Number(invoice.total_installments_on_invoice),
				installmentsPaid: Number(invoice.installments_paid),
				installmentsPending: Number(invoice.installments_pending)
			};
		});

		return details;
	}

	async invoiceSearch(currentInvoiceDueDate: Date, where: Prisma.Sql, limit: Prisma.Sql){

		const result = await prisma.$queryRaw<any[]>`
			select
				invoices.id as invoice_id,
				invoices.pay,
				invoices.due_date,
				invoices.closing_date,
				users.limit,
				case when invoices.due_date = ${currentInvoiceDueDate} then true else false end as "current",
				sum(installments.installment_value) as amount,
				sum(case when shopping.type_invoice = 'FIXED_EXPENSE' then installments.installment_value else 0 end) as total_fixed_expense,
				sum(case when shopping.type_invoice = 'EXTRA_EXPENSE' then installments.installment_value else 0 end) as total_extra_expense,
				sum(case when shopping.payment_method = 'INVOICE' then installments.installment_value else 0 end) as total_invoice,
				sum(case when shopping.payment_method = 'CARD' then installments.installment_value else 0 end) as total_card,
				sum(case when shopping.payment_method = 'MONEY' then installments.installment_value else 0 end) as total_money,
				json_build_object(
					'fixedExpense', coalesce(
						json_agg(
							json_build_object(
								'installmentId', installments.id,
								'installmentNumber', installments.installment_number,
								'installmentValue', installments.installment_value,
								'pay', installments.pay,
								'dueDate', installments.due_date,
								'shoppingId', installments.shopping_id,
								'totalInstallments', shopping.total_installments,
								'typeInvoice', shopping.type_invoice,
								'paymentMethod', shopping.payment_method,
								'name', shopping.name,
	      						'purchaseDate', shopping.created_at
							)
							order by installments.created_at desc
						)filter (where shopping.type_invoice = 'FIXED_EXPENSE'),
					'[]'::json
					),
					
					'extraExpense', coalesce(
						json_agg(
							json_build_object(
								'installmentId', installments.id,
								'installmentNumber', installments.installment_number,
								'installmentValue', installments.installment_value,
								'dueDate', installments.due_date,
	  							'pay', installments.pay,
								'shoppingId', installments.shopping_id,
								'totalInstallments', shopping.total_installments,
								'typeInvoice', shopping.type_invoice,
								'paymentMethod', shopping.payment_method,
								'name', shopping.name,
	      						'purchaseDate', shopping.created_at
							)
							order by installments.created_at desc
						)filter (where shopping.type_invoice = 'EXTRA_EXPENSE'),
					'[]'::json
					)
					
				) as installments

			from
				invoices
				inner join installments on installments.invoice_id = invoices.id
				inner join shopping on shopping.id = installments.shopping_id
				inner join users on users.id = invoices.user_id
			
			where
				${where}
			
			group by invoices.id, invoices.due_date, users.limit
			order by invoices.due_date
			${limit};
		`;


		function convertValues(installments: any[]){
			return installments.map((installment) => {
				return {
					installmentId: installment.installmentId,
					installmentNumber: Number(installment.installmentNumber),
					installmentValue: Prisma.Decimal(installment.installmentValue),
					dueDate: installment.dueDate,
					pay: installment.pay,
					shoppingId: installment.shoppingId,
					totalInstallments: Number(installment.totalInstallments),
					typeInvoice: installment.typeInvoice,
					paymentMethod: installment.paymentMethod,
					name: installment.name,
					purchaseDate: installment.purchaseDate
				};
			});
		}


		const invoices: DetailedInvoice[] = result.map((invoice) => {
			return {
				invoiceId: invoice.invoice_id,
				pay: invoice.pay,
				dueDate: invoice.due_date,
				closingDate: invoice.closing_date,
				current: invoice.current,
				amount: Prisma.Decimal(invoice.amount),
				limit: Prisma.Decimal(invoice.limit),
				available: Prisma.Decimal(invoice.limit - invoice.amount),
				totalFixedExpense: Prisma.Decimal(invoice.total_fixed_expense),
				totalExtraExpense: Prisma.Decimal(invoice.total_extra_expense),
				totalInvoice: Prisma.Decimal(invoice.total_invoice),
				totalCard: Prisma.Decimal(invoice.total_card),
				totalMoney: Prisma.Decimal(invoice.total_money),
				installments: {
					extraExpense: invoice.installments.extraExpense.length > 0 ? convertValues(invoice.extraExpense) : [],
					fixedExpense: invoice.installments.fixedExpense.length > 0 ? convertValues(invoice.fixedExpense) : [],
				}
			};
		});


		return invoices;
	}

	async payInvoice(invoiceId: string[]){
		return await prisma.invoice.updateManyAndReturn({
			where: { id: { in: invoiceId } },
			data: { pay: true }
		});
	}
}