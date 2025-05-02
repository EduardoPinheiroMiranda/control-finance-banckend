import { Prisma } from "@prisma/client";
import { InvoiceDatabaseInterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";
import { Invoice } from "@/@types/prismaTypes";


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

	async getAllInvoices(userId: string, currentInvoiceDueDate: Date){
		
		const where = `where invoices.user_id = ${userId}`;
		const invoices = await this.invoiceSearch(currentInvoiceDueDate, where);
		
		return invoices;
	}

	async getCurrentInvoice(userId: string, dueDate: Date){

		const where = `where invoices.due_date=${dueDate} AND invoices.user_id = ${userId}`;
		const invoice = await this.invoiceSearch(dueDate, where);
		
		return invoice;		
	}

	async invoiceSearch(currentInvoiceDueDate: Date, where: string){

		const invoices = await prisma.$queryRaw<Invoice[]>`

			select
				invoices.id as invoice_id,
				invoices.pay,
				invoices.due_date,
				invoices.closing_date,
				case when invoices.due_date = ${currentInvoiceDueDate} then true else false end as "current",
				sum(installments.installment_value) as amount,
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
				INNER JOIN installments ON installments.invoice_id = invoices.id
				INNER JOIN shopping ON shopping.id = installments.shopping_id
			
			${where}
			
			group by invoices.id, invoices.due_date
			order by invoices.due_date;
		`;


		return invoices;
	}
}