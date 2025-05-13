import { Prisma } from "@prisma/client";
import { InvoiceDatabaseInterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";
import { CardInvoice, Invoice, InvoiceDetails } from "@/@types/prismaTypes";


export class InvoicePrismaRepository implements InvoiceDatabaseInterface{

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
		
		const invoices = await prisma.$queryRaw<CardInvoice[]>`
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

		return invoices;
	}

	async getAllInvoices(userId: string, currentInvoiceDueDate: Date){
		
		const where = Prisma.sql`invoices.user_id = ${userId}`;
		const invoices = await this.invoiceSearch(currentInvoiceDueDate, where);
		
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
		const invoice = await this.invoiceSearch(dueDate, where);
		
		return invoice;		
	}

	async invoiceDetails(invoiceId: string){
		
		const details = await prisma.$queryRaw<InvoiceDetails[]>`
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


		return details;
	}

	async invoiceSearch(currentInvoiceDueDate: Date, where: Prisma.Sql){

		const invoices = await prisma.$queryRaw<Invoice[]>`
			select
				invoices.id as invoice_id,
				invoices.pay,
				invoices.due_date,
				invoices.closing_date,
				case when invoices.due_date = ${currentInvoiceDueDate} then true else false end as "current",
				sum(case when installments.pay = false then installments.installment_value else 0 end) as amount,
				sum(case when shopping.type_invoice = 'fixedExpense' then installments.installment_value else 0 end) as total_fixed_expense,
				sum(case when shopping.type_invoice = 'extraExpense' then installments.installment_value else 0 end) as total_extra_expense,
				sum(case when shopping.payment_method = 'invoice' then installments.installment_value else 0 end) as total_invoice,
				sum(case when shopping.payment_method = 'card' then installments.installment_value else 0 end) as total_card,
				sum(case when shopping.payment_method = 'money' then installments.installment_value else 0 end) as total_money,
				json_build_object(
					'fixedExpense', coalesce(
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
								'name', shopping.name
							)
							order by installments.created_at desc
						)filter (where shopping.type_invoice = 'fixedExpense'),
					'[]'::json
					),
					
					'extraExpense', coalesce(
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
						)filter (where shopping.type_invoice = 'extraExpense'),
					'[]'::json
					)
					
				) as installments

			from
				invoices
				inner join installments on installments.invoice_id = invoices.id
				inner join shopping on shopping.id = installments.shopping_id
			
			where
				${where}
			
			group by invoices.id, invoices.due_date
			order by invoices.due_date
			limit 1;
		`;


		return invoices;
	}

	async payInvoice(invoiceId: string){
		
		const invoicePaid = await prisma.invoice.update({
			where: {
				id: invoiceId
			},
			data: {
				pay: true
			}
		});


		 return invoicePaid;
	}

}