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


		const [ invoice, valueDetails ] = await Promise.all([
			this.invoiceRepository.getCurrentInvoice(userId, date[0].dueDate),
			this.invoiceRepository.getValuesTheInvoice(userId, date[0].dueDate)
		]);


		if(invoice.extraExpense.length === 0 && invoice.fixedExpense.length ===0){
			throw new DataValidationError("Sua fatura não foi encontrada.");
		}


		const userLimit = Number(user.limit);
		const percentegeSpent = Math.ceil((valueDetails.amount / userLimit) * 100);
		const available = userLimit - valueDetails.amount;


		return {
			invoiceId: valueDetails.invoiceId,
			dueDate: date[0].dueDate,
			closingDate: date[0].closingDate,
			percentegeSpent,
			limit: userLimit,
			amount: valueDetails.amount,
			available,
			totalCard: valueDetails.totalCard,
			totalInvoice: valueDetails.totalInvoice,
			totalMoney: valueDetails.totalMoney,
			totalFixedExpense: valueDetails.totalFixedExpense,
			totalExtraExpense: valueDetails.totalExtraExpense,
			invoice
		};
	}
}