import { Dates, Invoice } from "@/@types/customTypes";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";


export async function createInvoices(
	userId: string,
	datesForInvoices: Dates[],
	invoiceRepository: InvoiceDatabaseInterface
){

	const dueDates = datesForInvoices.map((dates) => dates.dueDate.toISOString());
	const invoicesCreated = await invoiceRepository.findInvoicesFromDueDate(userId, dueDates);
	const createNewInvoices: Invoice[] = [];


	if(invoicesCreated.length === dueDates.length){
		return {
			invoices: invoicesCreated.sort((a,b) => a.due_date.getTime() - b.due_date.getTime()),
			createNewInvoices
		};
	}
	

	datesForInvoices.forEach((dates) => {

		const invoice = invoicesCreated.find((invoiceCreated) => {
			if(invoiceCreated.due_date.getTime() === dates.dueDate.getTime()){
				return invoiceCreated;
			}
		});

		if(!invoice){
			createNewInvoices.push({
				due_date: dates.dueDate,
				closing_date: dates.closingDate,
				user_id: userId
			});
		}
	});


	const invoices = await invoiceRepository.create(createNewInvoices);


	const allInvoices = [...invoices, ...invoicesCreated].sort(
		(a,b) => a.due_date.getTime() - b.due_date.getTime()
	);

	
	return {
		invoices: allInvoices,
		newInvoices: invoices,
		invoicesCreated,
		createNewInvoices
	};
}