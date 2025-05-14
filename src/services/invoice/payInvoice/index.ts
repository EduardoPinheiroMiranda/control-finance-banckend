import { InstallmentWithTotalInstallments, InvoiceDetails } from "@/@types/prismaTypes";
import { DataValidationError } from "@/errors/custonErros";
import { makeGetCurrentInvoice } from "@/factories/invoice/make-getCurrentInvoice";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";


export class PayInvoice{

	constructor(
        private invoiceRepository: InvoiceDatabaseInterface,
        private installmentRepository: InstallmentDatabaseInterface,
        private shoppingRepository: ShoppingDatabaseInterface
	){}


	async confirmInvoicePayment(userId: string, invoiceDetails: InvoiceDetails[]){

		const totalInstallmentsOnInvoice = invoiceDetails[0].total_installments_on_invoice;
		const totalInstallmentsPaid = invoiceDetails[0].installments_paid;
		
		const currentDate = new Date().getTime();
		const closingDate = new Date(invoiceDetails[0].closing_date).getTime();


		if(totalInstallmentsOnInvoice === totalInstallmentsPaid && currentDate > closingDate){
			await this.invoiceRepository.payInvoice(invoiceDetails[0].id);
		}


		const serviceGetCurrentInvoice = makeGetCurrentInvoice();
		const currentInvoice = await serviceGetCurrentInvoice.execute(userId);

		
		return currentInvoice;
	}

	async confirmFullPaymentForAPurchase(installments: InstallmentWithTotalInstallments[]){

		const shoppingId: string[] = [];

		installments.forEach((installment) => {
			if(installment.installment_number === installment.shoppingId.total_installments){
				shoppingId.push(installment.shopping_id);
			}
		});


		if(shoppingId.length > 0){
			return await this.shoppingRepository.payShopping(shoppingId);
		}


		return 0;
	}

	async execute(userId: string, invoiceId: string, installmentsToPay: string[]){

		if(installmentsToPay.length === 0){
			const currentInvoice = await this.confirmInvoicePayment(userId, []);
			return currentInvoice;
		}


		const installmentsPaid = await this.installmentRepository.payInstallments(
			invoiceId,
			installmentsToPay
		);

		if(installmentsPaid.length === 0){
			throw new DataValidationError("Houve um problema para confirmar os pagamentos, tente novamente.");
		}


		const [ invoiceDetails ] = await Promise.all([
			this.invoiceRepository.invoiceDetails(invoiceId),
			this.confirmFullPaymentForAPurchase(installmentsPaid)
		]);


		const currentInvoice = await this.confirmInvoicePayment(userId, invoiceDetails);
		
		
		return currentInvoice;
	}
}