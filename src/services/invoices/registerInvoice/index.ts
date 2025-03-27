import { Invoice } from "@/@types/customTypes";
import { InvoiceDatabaseinterface } from "@/repositories/interfaces/invoice";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { getDateNow } from "@/utils/getDateNow";


export class RegisterInvoice{

	#typeInvoices = ["fixedExpense", "extraExpenses"];
	#paymentMethods = ["invoice", "card", "monney"];


	constructor(
        private userRepositoory: UserDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseinterface
	){}


	async execute(data: Invoice, userId: string){
        
		const user = await this.userRepositoory.getById(userId);

		if(!user){
			throw new Error("Usuário inexistente.");
		}


		const typeInvoiceIsValid = this.#typeInvoices.find(
			(type) => type === data.typeInvoice
		);

		if(!typeInvoiceIsValid){
			throw new Error("Tipo de fatura invalido");
		}


		if(data.value <= 0){
			throw new Error("Valor da fatura invalido.");
		}


		const currrentDate = new Date().toLocaleDateString("pt-br");

		if(data.paymentMethod !== "card" && data.expired <= currrentDate){
			throw new Error("Data de vencimento deve ser superior ao dia atual.");
		}


		const paymentMethodIsValid = this.#paymentMethods.find(
			(type) => type === data.paymentMethod
		);

		if(!paymentMethodIsValid){
			throw new Error("Metodo de pagamento invalido.");
		}


		if(data.paymentMethod === "card" && data.numberOfInstallments <= 0){
			throw new Error("Quantidade de parcelas invalidas");
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
			installments_paid: data.installmentsPaid,
			created_at: getDateNow,
			updated_at: getDateNow,
			userId: user.id
		});


		return invoice;
	}
}