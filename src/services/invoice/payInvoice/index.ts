import { InstallmentWithTotalInstallments } from "@/@types/prismaTypes";
import { DataValidationError } from "@/errors/custonErros";
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

		const currentInvoice = await this.invoiceRepository.getById(invoiceId);

		if(!currentInvoice){
			throw new DataValidationError("Houve um problema para encontrar os dados da fatura, tente novamente.");
		}


		const totalInstallments = currentInvoice.installment.length;
		const installmentsPaid = await this.installmentRepository.payInstallments(installmentsToPay);
		const totalInstallmentsPaid = await this.installmentRepository.totalInstallmentsPaid(invoiceId);


		await this.confirmFullPaymentForAPurchase(installmentsPaid);
        

		if(totalInstallments === totalInstallmentsPaid){

			await this.invoiceRepository.payInvoice(invoiceId);

			return {
				invoicePaid: true,
				totalInstallments,
				totalInstallmentsPaid
			};
		}


		return {
			invoicePaid: false,
			totalInstallments,
			totalInstallmentsPaid
		};

	}
}