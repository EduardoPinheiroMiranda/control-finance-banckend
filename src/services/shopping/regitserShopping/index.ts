import { Shopping } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { createInvoices } from "./createInvoices";
import { createInstallments } from "./createInstallments";
import { CardValidation } from "./cardValidation";
import { checkPurchaseDate } from "./checkPurchaseDate";
import { typeInvoices } from "@/utils/globalValues";
import { Invoice } from "@prisma/client";


export class RegisterShopping{

	constructor(
        private userRepository: UserDatabaseInterface,
        private shoppingRepository: ShoppingDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseInterface,
		private installmentRepository: InstallmentDatabaseInterface,
		private cardRepository: CardDatabaseInterface
	){}


	async registerShopping(userId: string, data: Shopping, invoices: Invoice[]){

		const shopping = await this.shoppingRepository.create({
			name: data.name,
			type_invoice: data.typeInvoice,
			payment_method: data.paymentMethod,
			value: data.value,
			total_installments: data.totalInstallments,
			description: data.description,
			category_id: data.categoryId,
			card_id: data.cardId,
			user_id: userId
		});


		const { installments } = await createInstallments(
			shopping.id,
			data.value,
			data.totalInstallments,
			data.dueDay,
			invoices,
			this.installmentRepository
		);


		return {
			shopping,
			installments
		};
	}


	async execute(userId: string, data: Shopping){

		const user = await this.userRepository.getById(userId);

		if(!user){
			throw new ResourceNotFoud("Usuário não foi encontrado.");
		}
		

		if(data.value <= 0 || data.totalInstallments <= 0){
			throw new DataValidationError("Valor ou quantidade de parcelas da compra não pode ser menor, ou igual a 0.");
		}
		

		const startOnTheInvoice = await CardValidation(
			data.paymentMethod,
			data.cardId,
			this.cardRepository
		);

		
		const datesForInvoices = await checkPurchaseDate(
			data.purchaseDate,
			user.due_day,
			user.close_day,
			data.totalInstallments,
			startOnTheInvoice
		);


		if(data.typeInvoice === typeInvoices[0]){

			let invoicesCreated = await this.invoiceRepository.findOpenInvoices(userId);

			if(invoicesCreated.length === 0){

				const { invoices } = await createInvoices(
					userId,
					datesForInvoices,
					this.invoiceRepository
				);
			
				invoicesCreated = invoices;
			}


			const { shopping, installments } = await this.registerShopping(
				user.id,
				data,
				invoicesCreated
			);


			return { shopping, installments };
		}


		const { invoices } = await createInvoices(
			user.id,
			datesForInvoices,
			this.invoiceRepository
		);


		const { shopping, installments} = await this.registerShopping(
			user.id,
			data,
			invoices
		);


		return {
			shopping,
			installments
		};		
	}
}

