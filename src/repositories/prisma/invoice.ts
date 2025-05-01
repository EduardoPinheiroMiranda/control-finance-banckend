import { Prisma } from "@prisma/client";
import { InvoiceDatabaseInterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";
import { InvoiceElements } from "@/@types/prismaTypes";
import { typeInvoices } from "@/utils/globalValues";


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

	async getCurrentInvoice(userId: string, dueDate: Date){
		
		const invoice = await prisma.$queryRaw<{
			type_invoice: string,
			installments: string
		}[]>`
			select
				shopping.type_invoice,
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
				) as installments
			from

				invoices

				INNER JOIN installments ON
				installments.invoice_id = invoices.id

				INNER JOIN shopping ON
				shopping.id = installments.shopping_id

			where 
				invoices.due_date=${dueDate} AND
				invoices.user_id = ${userId}

			group by shopping.type_invoice
			;
		`;
		

		let fixedExpense: InvoiceElements[] = [];
		let extraExpense: InvoiceElements[] = [];

		invoice.forEach((element) => {
			if(element.type_invoice === typeInvoices[0]){
				fixedExpense = JSON.parse(JSON.stringify(element.installments));
			}

			if(element.type_invoice === typeInvoices[1]){
				extraExpense = JSON.parse(JSON.stringify(element.installments));
			}
		});

		
		return {
			fixedExpense,
			extraExpense
		};
	}

	async getValuesTheInvoice(userId: string, dueDate: Date){
		
		const valueDetails = await prisma.$queryRaw<{
			invoice_id: string,
			amount: number,
			total_fixed_expense: number,
			total_extra_expense: number,
			total_invoice: number,
			total_card: number,
			total_money: number,
		}>`
			select
				invoices.id as invoice_id,
				sum(installments.installment_value) as amount,
				sum(case when shopping.type_invoice = 'fixedExpense' then installments.installment_value else 0 end) as total_fixed_expense,
				sum(case when shopping.type_invoice = 'extraExpense' then installments.installment_value else 0 end) as total_extra_expense,
				sum(case when shopping.payment_method = 'invoice' then installments.installment_value else 0 end) as total_invoice,
				sum(case when shopping.payment_method = 'card' then installments.installment_value else 0 end) as total_card,
				sum(case when shopping.payment_method = 'money' then installments.installment_value else 0 end) as total_money
			from

				invoices
				
				INNER JOIN installments ON
				installments.invoice_id = invoices.id
				
				INNER JOIN shopping ON
				shopping.id = installments.shopping_id
			
			where 
				invoices.due_date = ${dueDate} AND
				invoices.user_id = ${userId}
			
			group by invoices.id;
		`;


		return {
			invoiceId: valueDetails.invoice_id,
			amount: valueDetails.amount,
			totalFixedExpense: valueDetails.total_fixed_expense,
			totalExtraExpense: valueDetails.total_extra_expense,
			totalInvoice: valueDetails.total_invoice,
			totalCard: valueDetails.total_card,
			totalMoney: valueDetails.total_money
		};

	}
}