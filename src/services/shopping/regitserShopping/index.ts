import { Shopping } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { InvoiceDatabaseinterface } from "@/repositories/interfaces/invoice";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Installment } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";


interface Invoices{
    id: string,
    due_date: Date,
	close_date: Date,
    user_id: string
}


export class RegisterShopping{

	constructor(
        private userRepository: UserDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseinterface,
        private shoppingRepository: ShoppingDatabaseInterface,
		private installmentRepository: InstallmentDatabaseInterface,
		private cardRepository: CardDatabaseInterface
	){}


	async getUser(userId: string){

	    const user = await this.userRepository.getById(userId);

		if(!user){
			throw new ResourceNotFoud("Usuário não foi encontrado.");
		}

	    return {
			invoiceDueDate: user.expired,
			invoiceCloseDate: user.close_date
		};
	}

	async buildInstallments(
		shoppingId: string,
		purchaseValue: number,
		totalInstalments: number,
		dueDate: number,
		invoices: Invoices[],
	){

		const handlerDueDate = new HandlerDueDate();
		const listOfDates = handlerDueDate.generateDueDates(dueDate, dueDate - 1, totalInstalments);
		const dueDates = listOfDates.map((dates) => dates.dueDate);


		const installments: Installment[] = [];
		const dateNow = new Date();

		for(let i=0; i<totalInstalments; i++){
			installments.push({
				id: randomUUID(),
				installment_number: i+1,
				total_installments: totalInstalments,
				installment_value: Decimal(purchaseValue/totalInstalments),
				due_date: dueDates[i],
				pay: false,
				shopping_id: shoppingId,
				invoice_id: invoices[i].id,
				created_at: dateNow,
				updated_at: dateNow
			});
		}


		await this.installmentRepository.create(installments);


		return installments;
	}

	async buildInvoices(
		userId: string, 
		dueDay: number, 
		closeDay: number, 
		totalInstallments: number
	){

		const handlerDueDate = new HandlerDueDate();
		const invoicesDate = handlerDueDate.generateDueDates(dueDay, closeDay, totalInstallments);
		
		const dueDates = invoicesDate.map((dates) => dates.dueDate.toISOString());
		const createdInvoices = await this.invoiceRepository.findInvoicesFromDueDate(userId, dueDates);
		
		const listInvoice: Invoices[] = [];
        

		invoicesDate.forEach((dates) => {

			const invoice = createdInvoices.find((invoice) => {
				if(invoice.due_date.getTime() === dates.dueDate.getTime()){
					return invoice;
				}
			});


			if(invoice){
				listInvoice.push(invoice);
			}else{
				listInvoice.push({
					id: randomUUID(),
					due_date: dates.dueDate,
					close_date: dates.closeDate,
					user_id: userId
				});
			}
		});


		await this.invoiceRepository.create(listInvoice);


		return listInvoice;
	}

	async execute(userId: string, data: Shopping){

		if(data.value <= 0 || data.totalInstallments <= 0){
			throw new DataValidationError("Valor ou quantidade de parcelas da compra não pode ser menor, ou igual a 0.");
		}
        

		// const shopping = await this.shoppingRepository.create({
		// 	name: data.name,
		// 	type_invoice: data.typeInvoice,
		// 	payment_method: data.paymentMethod,
		// 	value: data.value,
		// 	total_installments: data.totalInstallments,
		// 	description: data.description,
		// 	category_id: data.categoryId,
		// 	card_id: data.cardId,
		// 	user_id: userId
		// });


		// const { invoiceDueDate, invoiceCloseDate} = await this.getUser(userId);


		// const listInvoice = await this.buildInvoices(
		// 	userId,
		// 	invoiceDueDate,
		// 	invoiceCloseDate,
		// 	data.totalInstallments
		// );



	}
}

