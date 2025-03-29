import { Invoice } from "@/@types/customTypes";
import { DataValidationError } from "@/errors/custonErros";
import { InvoiceDatabaseinterface } from "@/repositories/interfaces/invoice";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { getDateNow } from "@/utils/getDateNow";


export class RegisterInvoice{

	#typeInvoices = ["fixedExpense", "extraExpenses"];
	#paymentMethods = ["invoice", "card", "monney"];


	constructor(
        private userRepository: UserDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseinterface
	){}


	async execute(data: Invoice, userId: string){
        
		const user = await this.userRepository.getById(userId);

		if(!user){
			throw new DataValidationError("Usuário inexistente.");
		}


		const typeInvoiceIsValid = this.#typeInvoices.find(
			(type) => type === data.typeInvoice
		);

		if(!typeInvoiceIsValid){
			throw new DataValidationError("Tipo de fatura invalido.");
		}


		if(data.value <= 0){
			throw new DataValidationError("Valor da fatura invalido.");
		}


		const currrentDate = new Date().getDate().toString();

		if(
			data.typeInvoice === this.#typeInvoices[1] && 
			data.expired <= currrentDate
		){
			throw new DataValidationError("Data de vencimento deve ser superior ao dia atual.");
		}


		const paymentMethodIsValid = this.#paymentMethods.find(
			(type) => type === data.paymentMethod
		);

		if(!paymentMethodIsValid){
			throw new DataValidationError("Metodo de pagamento invalido.");
		}


		if(
			data.paymentMethod === this.#paymentMethods[1] && 
			data.numberOfInstallments <= 0
		){
			throw new DataValidationError("Quantidade de parcelas invalidas");
		}


		const invoice = await this.invoiceRepository.create({
			name: data.name,
			type_invoice: data.typeInvoice,
			payment_method: data.paymentMethod,
			value: data.value,
			pay: false,
			expired: data.expired,
			description: data.description,
			number_of_installments: data.numberOfInstallments,
			installments_paid: 0,
			created_at: getDateNow,
			updated_at: getDateNow,
			userId: user.id
		});


		return invoice;
	}
}