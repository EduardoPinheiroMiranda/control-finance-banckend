import { InstallmentWithTotalInstallments } from "@/@types/prismaTypes";
import { env } from "@/env";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";


export class PayInvoice{

	constructor(
        private invoiceRepository: InvoiceDatabaseInterface,
        private installmentRepository: InstallmentDatabaseInterface,
        private shoppingRepository: ShoppingDatabaseInterface
	){}


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

	async execute(invoiceId: string, installmentsToPay: string[]){

		const installmentsPaid = await this.installmentRepository.payInstallments(
			invoiceId,
			installmentsToPay
		);


		// verificar se aqui deve ser uma tratativa de erro caso o installmentsPaid seja um array vazio
		if(installmentsPaid.length > 0){
			await this.confirmFullPaymentForAPurchase(installmentsPaid);
		}


		const invoiceDetails = await this.installmentRepository.invoiceDetails(invoiceId);
		const totalInstallmentsPending = invoiceDetails[0].installments_pending;
		const totalInstallmentsPaid = invoiceDetails[0].installments_paid;
		const totalInstallmentsOnInvoice = invoiceDetails[0].total_installments_on_invoice;
		
		if(totalInstallmentsOnInvoice === totalInstallmentsPaid){
			
			const invoice = await this.invoiceRepository.payInvoice(invoiceId);

			return {
				invoicePaid: invoice.pay,
				totalInstallmentsOnInvoice,
				totalInstallmentsPaid,
				totalInstallmentsPending
			};
		}


		return {
			invoicePaid: false,
			totalInstallmentsOnInvoice,
			totalInstallmentsPaid,
			totalInstallmentsPending
		};


		// try{

			
	
		// }catch(err){

		// 	if(env.NODE_ENV == "test"){
		// 		console.log(err);
		// 	}

		// 	throw new Error("Houve um problema para encontrar os dados da fatura, tente novamente.");
		// }
	}
}