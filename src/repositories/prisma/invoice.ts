import { Prisma } from "@prisma/client";
import { InvoiceDatabaseInterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";
import { CardInvoice, Invoice, InvoiceDetails } from "@/@types/prismaTypes";
import { Decimal } from "@prisma/client/runtime/library";


export class InvoicePrismaRepository implements InvoiceDatabaseInterface{

	async advanceInvoices(){

		const invoices = await prisma.invoice.findMany({
			where: {
				pay: false,
				closing_date: {
					lte: new Date()
				}
			},
			include: {
				installment: {
					select: {
						pay: true
					}
				}
			},
			take: 100
		});


		return invoices;
	}

	async create(data: Prisma.InvoiceUncheckedCreateInput[]){
        
		const invoices = await prisma.invoice.createManyAndReturn({data});

		return invoices;
	}

	async findInvoicesFromDueDate(userId: string, dueDates: string[]){
		
		const invoices = await prisma.invoice.findMany({
			where: {
				OR: dueDates.map((date) => {
					return { due_date: date, user_id: userId };
				})
			}
		});

		return invoices;
	}

	async findOpenInvoices(userId: string){
		
		const invoices = await prisma.invoice.findMany({
			where:{
				user_id: userId,
				pay: false,
			},
			orderBy: {
				due_date: "asc"
			}
		});

		return invoices;
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
						'installment_id', installments.id,
						'installment_number', installments.installment_number,
						'installment_value', installments.installment_value,
						'due_date', installments.due_date,
						'pay', installments.pay,
						'shopping_id', installments.shopping_id,
						'total_installments', shopping.total_installments,
						'type_invoice', shopping.type_invoice,
						'payment_method', shopping.payment_method,
						'name', shopping.name
					)
					order by installments.created_at desc
				) as installments
			from
				invoices
				
				INNER JOIN installments ON
				installments.invoice_id = invoices.id
				
				INNER JOIN shopping ON
				shopping.id = installments.shopping_id
			where 
				invoices.user_id = ${userId} and
				shopping.card_id = ${cardId}
			
			group by invoices.id, invoices.due_date
			order by invoices.due_date;
		`;


		const invoices: CardInvoice[] = result.map((invoice) => {

			return{
				invoice_id: invoice.invoice_id,
				pay: invoice.pay,
				due_date: invoice.due_date,
				current: invoice.current,
				amount: Decimal(invoice.amount),
				installments: invoice.installments
			};
			
		});

		return invoices;
	}

	async getAllInvoices(userId: string, currentInvoiceDueDate: Date){
		
		const where = Prisma.sql`invoices.user_id = ${userId}`;
		const limit = Prisma.sql``;
		const invoices = await this.invoiceSearch(currentInvoiceDueDate, where, limit);
		
		return invoices;
	}

	async getById(invoiceId: string){
		
		const invoice = await prisma.invoice.findUnique({
			where: {
				id: invoiceId
			},
			include: {
				installment: true
			}
		});


		return invoice;
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
		const invoice = await this.invoiceSearch(dueDate, where, limit);
		
		return invoice;		
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
				invoices.id,
				invoices.due_date
			order by 
				invoices.due_date;
		`;


		const details: InvoiceDetails[] = result.map((invoice) => {
			return {
				id: invoice.id,
				due_date: invoice.due_date,
				closing_date: invoice.closing_date,
				total_installments_on_invoice: Number(invoice.total_installments_on_invoice),
				installments_paid: Number(invoice.installments_paid),
				installments_pending: Number(invoice.installments_pending)
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
				sum(case when shopping.type_invoice = 'fixedExpense' then installments.installment_value else 0 end) as total_fixed_expense,
				sum(case when shopping.type_invoice = 'extraExpense' then installments.installment_value else 0 end) as total_extra_expense,
				sum(case when shopping.payment_method = 'invoice' then installments.installment_value else 0 end) as total_invoice,
				sum(case when shopping.payment_method = 'card' then installments.installment_value else 0 end) as total_card,
				sum(case when shopping.payment_method = 'money' then installments.installment_value else 0 end) as total_money,
				json_build_object(
					'fixed_expense', coalesce(
						json_agg(
							json_build_object(
								'installment_id', installments.id,
								'installment_number', installments.installment_number,
								'installment_value', installments.installment_value,
								'pay', installments.pay,
								'due_date', installments.due_date,
								'shopping_id', installments.shopping_id,
								'total_installments', shopping.total_installments,
								'type_invoice', shopping.type_invoice,
								'payment_method', shopping.payment_method,
								'name', shopping.name,
          						'purchase_date', shopping.created_at
							)
							order by installments.created_at desc
						)filter (where shopping.type_invoice = 'fixedExpense'),
					'[]'::json
					),
					
					'extra_expense', coalesce(
						json_agg(
							json_build_object(
								'installment_id', installments.id,
								'installment_number', installments.installment_number,
								'installment_value', installments.installment_value,
								'due_date', installments.due_date,
      							'pay', installments.pay,
								'shopping_id', installments.shopping_id,
								'total_installments', shopping.total_installments,
								'type_invoice', shopping.type_invoice,
								'payment_method', shopping.payment_method,
								'name', shopping.name,
          						'purchase_date', shopping.created_at
							)
							order by installments.created_at desc
						)filter (where shopping.type_invoice = 'extraExpense'),
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


		const invoice: Invoice[] = result.map((invoice) => {
			return {
				invoice_id: invoice.invoice_id,
				pay: invoice.pay,
				due_date: invoice.due_date,
				closing_date: invoice.closing_date,
				current: invoice.current,
				amount: Decimal(invoice.amount),
				limit: Decimal(invoice.limit),
				available: Decimal(invoice.limit - invoice.amount),
				total_fixed_expense: Decimal(invoice.total_fixed_expense),
				total_extra_expense: Decimal(invoice.total_extra_expense),
				total_invoice: Decimal(invoice.total_invoice),
				total_card: Decimal(invoice.total_card),
				total_money: Decimal(invoice.total_money),
				installments: invoice.installments
			};
		});


		return invoice;
	}

	async payInvoice(invoiceId: string[]){
		
		const invoicePaid = await prisma.invoice.updateManyAndReturn({
			where: {
				id: { in: invoiceId }
			},
			data: {
				pay: true
			}
		});


		 return invoicePaid;
	}

}