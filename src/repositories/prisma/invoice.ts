import { Invoice, Prisma } from "@prisma/client";
import { InvoiceDatabaseInterface } from "../interfaces/invoice";
import { prisma } from "@/libs/primsa";


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
		
		const resul = await prisma.$executeRaw<{
			type_invoice: string;
  			installments: string;
		}[]>`
				select

					shopping.type_invoice,
					json_group_array(
						json_object(
							'id', installments.id,
							'installment_number', installments.installment_number,
							'installment_value', installments.installment_value,
							'due_date', installments.due_date,
							'shopping_id', installments.shopping_id,
							'total_installments', shopping.total_installments
						)
					) AS installments

				from

					invoices

					INNER JOIN installments ON
					installments.invoice_id = invoices.id

					INNER JOIN shopping ON
					shopping.id = installments.shopping_id

				where 

					invoices.due_date='1746921599000' AND
					invoices.user_id = 'b79ef2c4-4284-412b-b248-d3be3ff6bb4a'

				group by
					shopping.type_invoice
				;
		`;

	}
}