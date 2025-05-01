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
}