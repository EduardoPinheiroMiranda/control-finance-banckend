import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";


export async function confirmAdvanceInvoicePayments(){

	const invoiceRepository = new InvoicePrismaRepository();
	const invoices = await invoiceRepository.advanceInvoices();
	const invoicesToPay: string[] = [];

    
	invoices.forEach((invoice) => {
        
		const allInstallmentsHaveBeenPaid = invoice.installment.every(
			(installment) => installment.pay === true
		);


		if(allInstallmentsHaveBeenPaid){
			invoicesToPay.push(invoice.id);
		}
	});

    
	if(invoicesToPay.length > 0){
		await invoiceRepository.payInvoice(invoicesToPay);
	}
}