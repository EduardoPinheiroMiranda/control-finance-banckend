import { DataValidationError } from "@/errors/custonErros";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export class GetCurrentInvoice{

	constructor(
		private userRepository: UserDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseInterface
	){}


	async execute(userId: string){
		
		const user = await this.userRepository.getById(userId);

		if(!user){
			throw new DataValidationError("Erro ao buscar os dados do usuário informado.");
		}

		
		const dueDay = user.due_day;
		const closingDay = user.closing_day;
		const handlerDueDates = new HandlerDueDate();
		const date = handlerDueDates.generateDueDates(dueDay, closingDay, 1, false);


		const invoice = await this.invoiceRepository.getCurrentInvoice(userId, date[0].dueDate);


		if(invoice.length === 0 ){
			throw new DataValidationError("Sua fatura não foi encontrada.");
		}


		const userLimit = user.limit;
		const amountInvoice = invoice[0].amount;
		const percentegeSpent = amountInvoice.div(userLimit).times(100).round().toNumber();
		const available = userLimit.minus(amountInvoice).toNumber();


		return {
			percentegeSpent,
			limit: userLimit.toNumber(),
			available,

			invoice_id: invoice[0].invoice_id,
			pay: invoice[0].pay,
			due_date: invoice[0].due_date,
			closing_date: invoice[0].closing_date,
			current: invoice[0].current,

			amount: invoice[0].amount.toNumber(),
			total_fixed_expense: invoice[0].total_fixed_expense.toNumber(),
			total_extra_expense: invoice[0].total_extra_expense.toNumber(),
			total_card: invoice[0].total_card.toNumber(),
			total_money: invoice[0].total_money.toNumber(),
			total_invoice: invoice[0].total_invoice.toNumber(),
			installments: invoice[0].installments
		};
	}
}