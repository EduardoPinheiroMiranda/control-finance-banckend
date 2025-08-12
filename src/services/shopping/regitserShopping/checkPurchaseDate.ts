import { DataValidationError } from "@/errors/custonErros";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export async function checkPurchaseDate(
	purchaseDate: string | null,
	dueDay: number,
	closeDay: number,
	totalInstallments: number,
	startOnTheInvoice: boolean
){

	const currentDate = new Date();
	const purchaseMoment = !purchaseDate ? currentDate : new Date(purchaseDate);



	if(purchaseDate && currentDate.getTime() < purchaseMoment.getTime()){
		throw new DataValidationError("Data informada é invalidata.");
	}


	const invoiceDatesBasedOnPurchaseDate = new HandlerDueDate(purchaseDate).generateDueDates(
		dueDay,
		closeDay,
		totalInstallments,
		startOnTheInvoice
	);


	if(!purchaseDate || currentDate.getTime() === purchaseMoment.getTime()){
		// dates generated with current date
		return invoiceDatesBasedOnPurchaseDate;
	}


	const invoiceDatesBasedOnCurrentDate = new HandlerDueDate().generateDueDates(
		dueDay,
		closeDay,
		1,
		startOnTheInvoice
	);


	const currentInvoiceDueDate = invoiceDatesBasedOnCurrentDate[0].dueDate.getTime();


	const validInvoiceDates = invoiceDatesBasedOnPurchaseDate.filter((invoice) => {
        
		const invoiceDueDateBasedOnPurchaseDate = invoice.dueDate.getTime();

		if(invoiceDueDateBasedOnPurchaseDate >= currentInvoiceDueDate){
			return invoice;
		}
	});


	if(validInvoiceDates.length === 0){
		throw new DataValidationError("A data de compra não é valida. Com base na data e no número de parcelas informados, não haverá lançamentos para a fatura atual ou futuras.");
	}


	return validInvoiceDates; 
}
