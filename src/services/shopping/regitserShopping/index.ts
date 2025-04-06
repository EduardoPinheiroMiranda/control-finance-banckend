import { Shopping } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { InvoiceDatabaseinterface } from "@/repositories/interfaces/invoice";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { randomUUID } from "node:crypto";


interface NewInvoices{
    id: string,
    due_date: string,
    userId: string
}


export class RegisterShopping{

	constructor(
        private userRepository: UserDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseinterface,
        private shoppingRepository: ShoppingDatabaseInterface,
	){}


	async getUser(userId: string){

	    const user = await this.userRepository.getById(userId);

		if(!user){
			throw new ResourceNotFoud("Usuário não foi encontrado");
		}

	    return {
			invoiceDueDate: user.expired,
			invoiceCloseDate: user.close_date
		};
	}

	async buildInstallments(userId: string, data: Shopping){

	}

	async buildInvoices(
		userId: string, 
		dueDay: number, 
		closeDate: number, 
		totalInstallments: number
	){

		const handlerDueDate = new HandlerDueDate();
		const dueDates = handlerDueDate.generateMultipleDeuDates(dueDay, closeDate, totalInstallments);
		const invoices = await this.invoiceRepository.findInvoicesFromDueDate(userId, dueDates);
		const newInvoices: NewInvoices[] = [];
        

		dueDates.forEach((date) => {
			const invoice = invoices.find((invoice) => String(invoice.due_date) == date);

			if(!invoice){
				newInvoices.push({
					id: randomUUID(),
					due_date: date,
					close_date: // incluir geração de dadta de vencimento junto ao gerador de vencimentos
					userId: userId
				});
			}
		});


		await this.invoiceRepository.create(newInvoices);


		return {
			invoices: [...invoices, ...newInvoices]
		};
	}

	async execute(userId: string, data: Shopping){

		if(data.value <= 0 || data.totalInstallments <= 0){
			throw new DataValidationError("Valor ou quantidade de parcelas da compra não pode ser menor, ou igual a 0.");
		}
        

		const shopping = await this.shoppingRepository.create({
			name: data.name,
			type_invoice: data.typeInvoice,
			payment_method: data.paymentMethod,
			value: data.value,
			total_installments: data.totalInstallments,
			description: data.description,
			categoryId: data.categoryId,
			cardId: data.cardId,
			userId: userId
		});


		const { invoiceDueDate, invoiceCloseDate} = await this.getUser(userId);


		const { invoices } = await this.buildInvoices(userId, invoiceDueDate, data.totalInstallments);
	}
}

