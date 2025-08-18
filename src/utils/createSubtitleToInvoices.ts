
export function createSubtitleToInvoices(invoices: {
    invoiceId: string,
    pay: boolean,
    dueDate: Date,
    current: boolean,
}[]){

	const month = ["JAN","FEV","MAR","ABR","MAIO","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

	const subtitle = invoices.map((invoice) => {

		const getMonth = invoice.dueDate.getMonth();
		const getYear = invoice.dueDate.getFullYear();

		return {
			invoiceId: invoice.invoiceId,
			current: invoice.current,
			pay: invoice.pay,
			label: `${month[getMonth]}/${getYear}`
		};
	});


	return subtitle;
}