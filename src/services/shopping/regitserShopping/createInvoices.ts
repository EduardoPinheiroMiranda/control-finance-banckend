import { Dates, Invoice } from "src/@types/customTypes";
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
			invoices: invoicesCreated.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()),
			createNewInvoices
		};
	}
	

	datesForInvoices.forEach((dates) => {

		const invoice = invoicesCreated.find((invoiceCreated) => {
			if(invoiceCreated.dueDate.getTime() === dates.dueDate.getTime()){
				return invoiceCreated;
			}
		});

		if(!invoice){
			createNewInvoices.push({
				dueDate: dates.dueDate,
				closingDate: dates.closingDate,
				userId: userId
			});
		}
	});


	const invoices = await invoiceRepository.create(createNewInvoices);


	const allInvoices = [...invoices, ...invoicesCreated].sort(
		(a,b) => a.dueDate.getTime() - b.dueDate.getTime()
	);

	
	return {
		invoices: allInvoices,
		newInvoices: invoices,
		invoicesCreated,
		createNewInvoices
	};
}