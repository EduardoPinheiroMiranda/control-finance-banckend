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


export class RegisterShopping{

	constructor(
        private userRepository: UserDatabaseInterface,
        private shoppingRepository: ShoppingDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseInterface,
		private installmentRepository: InstallmentDatabaseInterface,
		private cardRepository: CardDatabaseInterface
	){}


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


		const { invoices } = await createInvoices(
			userId,
			user.expired,
			user.close_date,
			data.totalInstallments,
			this.invoiceRepository,
			startOnTheInvoice
		);


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
}

