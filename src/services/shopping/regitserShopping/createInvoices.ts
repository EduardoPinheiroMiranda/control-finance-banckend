import { Invoices } from "@/@types/customTypes";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export async function createInvoices(
	userId: string, 
	dueDay: number, 
	closeDay: number, 
	totalInstallments: number,
	invoiceRepository: InvoiceDatabaseInterface,
	startOnTheInvoice: boolean
){


	const handlerDueDate = new HandlerDueDate();
	const invoicesDate = handlerDueDate.generateDueDates(
		dueDay, closeDay, totalInstallments, startOnTheInvoice
	);
        
	const dueDates = invoicesDate.map((dates) => dates.dueDate.toISOString());
	const invoicesCreated = await invoiceRepository.findInvoicesFromDueDate(
		userId, dueDates
	);
        
	const createInvoices: Invoices[] = [];
        

	invoicesDate.forEach((dates) => {

		const invoice = invoicesCreated.find((invoice) => {
			if(invoice.due_date.getTime() === dates.dueDate.getTime()){
				return invoice;
			}
		});

		if(!invoice){
			createInvoices.push({
				due_date: dates.dueDate,
				close_date: dates.closeDate,
				user_id: userId
			});
		}
	});


	const invoices = await invoiceRepository.create(createInvoices);


	return {
		invoices: [...invoices, ...invoicesCreated].sort(
			(a,b) => a.due_date.getTime() - b.due_date.getTime()
		),
		createInvoices
	};
}