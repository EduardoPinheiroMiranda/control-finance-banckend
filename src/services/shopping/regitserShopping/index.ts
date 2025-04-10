import { Installment, Invoices, Shopping } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { InvoiceDatabaseinterface } from "@/repositories/interfaces/invoice";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";


export class RegisterShopping{

	constructor(
        private userRepository: UserDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseinterface,
        private shoppingRepository: ShoppingDatabaseInterface,
		private installmentRepository: InstallmentDatabaseInterface,
		private cardRepository: CardDatabaseInterface
	){}


	// async buildInstallments(
	// 	shoppingId: string,
	// 	purchaseValue: number,
	// 	totalInstalments: number,
	// 	dueDate: number,
	// 	invoices: Invoices[],
	// ){

	// 	const handlerDueDate = new HandlerDueDate();
	// 	const listOfDates = handlerDueDate.generateDueDates(dueDate, dueDate - 1, totalInstalments);
	// 	const dueDates = listOfDates.map((dates) => dates.dueDate);


	// 	const createInstallments: Installment[] = [];

	// 	for(let i=0; i<totalInstalments; i++){
	// 		createInstallments.push({
	// 			installment_number: i+1,
	// 			total_installments: totalInstalments,
	// 			installment_value: Decimal(purchaseValue/totalInstalments),
	// 			due_date: dueDates[i],
	// 			shopping_id: shoppingId,
	// 			invoice_id: invoices[i].id,
	// 		});
	// 	}


	// 	const installments = await this.installmentRepository.create(createInstallments);


	// 	return {
	// 		installments,
	// 		createInstallments
	// 	};
	// }

	// async buildInvoices(
	// 	userId: string, 
	// 	dueDay: number, 
	// 	closeDay: number, 
	// 	totalInstallments: number
	// ){

	// 	const handlerDueDate = new HandlerDueDate();
	// 	const invoicesDate = handlerDueDate.generateDueDates(dueDay, closeDay, totalInstallments);
		
	// 	const dueDates = invoicesDate.map((dates) => dates.dueDate.toISOString());
	// 	const invoicesCreated = await this.invoiceRepository.findInvoicesFromDueDate(userId, dueDates);
		
	// 	const createInvoices: Invoices[] = [];
        

	// 	invoicesDate.forEach((dates) => {

	// 		const invoice = invoicesCreated.find((invoice) => {
	// 			if(invoice.due_date.getTime() === dates.dueDate.getTime()){
	// 				return invoice;
	// 			}
	// 		});

	// 		if(!invoice){
	// 			createInvoices.push({
	// 				id: randomUUID(),
	// 				due_date: dates.dueDate,
	// 				close_date: dates.closeDate,
	// 				user_id: userId
	// 			});
	// 		}
	// 	});


	// 	const invoices = await this.invoiceRepository.create(createInvoices);


	// 	return {
	// 		invoices: [...invoicesCreated, ...invoices].toSorted()
	// 	};
	// }

	async execute(userId: string, data: Shopping){

		// const user = await this.userRepository.getById(userId);

		// if(!user){
		// 	throw new ResourceNotFoud("Usuário não foi encontrado.");
		// }
		

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

