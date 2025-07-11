import { Dates, Shopping } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { createInvoices } from "./createInvoices";
import { createInstallments } from "./createInstallments";
import { cardValidation } from "./cardValidation";
import { checkPurchaseDate } from "./checkPurchaseDate";
import { paymentMethods, typeInvoices } from "@/utils/globalValues";
import { Invoice } from "@prisma/client";
import { insertFixedPurchasesIntoNewInvoices } from "./insertFixedPurchasesIntoNewInvoices";


export class RegisterShopping{

	constructor(
        private userRepository: UserDatabaseInterface,
        private shoppingRepository: ShoppingDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseInterface,
		private installmentRepository: InstallmentDatabaseInterface,
		private cardRepository: CardDatabaseInterface
	){}


	async registerShopping(userId: string, data: Shopping, invoices: Invoice[]){

		if(!data.dueDay){
			throw new DataValidationError("O dia do venciamento da compra deve ser informado.");
		}
		

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


		return { shopping, installments };
	}

	
	async registerFixedPurchase(userId: string, datesForInvoices: Dates[], data: Shopping){

		const invoicesCreated = await this.invoiceRepository.findOpenInvoices(userId);

		if(invoicesCreated.length === 0){

			const { invoices } = await createInvoices(userId, datesForInvoices, this.invoiceRepository);
			const { shopping, installments } = await this.registerShopping(userId, data, invoices);
			
			return { shopping, installments };
		}


		const { shopping, installments } = await this.registerShopping(userId, data, invoicesCreated);

		return { shopping, installments };
	}


	async registerExtraPurchase(userId: string, datesForInvoices: Dates[], data: Shopping){

		const { invoices, newInvoices } = await createInvoices(userId, datesForInvoices, this.invoiceRepository);

		if(newInvoices){
			await insertFixedPurchasesIntoNewInvoices(
				userId,
				newInvoices,
				this.shoppingRepository,
				this.installmentRepository
			);
		}

		const { shopping, installments} = await this.registerShopping(userId, data, invoices);

		return { shopping, installments };
	}


	async execute(userId: string, data: Shopping){

		const user = await this.userRepository.getById(userId);

		if(!user){
			throw new ResourceNotFoud("Usuário não foi encontrado.");
		}
		

		if(data.value <= 0 || data.totalInstallments <= 0){
			throw new DataValidationError("Valor ou quantidade de parcelas da compra não pode ser menor, ou igual a 0.");
		}

		if(data.totalInstallments > 72){
			throw new DataValidationError("Não é possível adicionar uma compra com mais de 72 parcelas, neste cenário recomendamos alterar o tipo da compra para fixa.");
		}
		

		const { startOnTheInvoice, dueDay} = await cardValidation(
			data.paymentMethod,
			data.cardId,
			this.cardRepository
		);

		
		const datesForInvoices = await checkPurchaseDate(
			data.purchaseDate,
			user.due_day,
			user.closing_day,
			data.totalInstallments,
			startOnTheInvoice
		);

		
		if(data.paymentMethod === paymentMethods[1]){
			data.dueDay = dueDay
		}


		if(data.typeInvoice === typeInvoices[0]){
			const { shopping, installments } = await this.registerFixedPurchase(user.id, datesForInvoices, data);
			return { shopping, installments };
		}


		const { shopping, installments } = await this.registerExtraPurchase(user.id, datesForInvoices, data);
		
		return { shopping, installments };		
	}
}

