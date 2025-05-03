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


		const userLimit = Number(user.limit);
		const amountInvoice = invoice[0].amount;
		const percentegeSpent = Math.ceil((amountInvoice / userLimit) * 100);
		const available = userLimit - amountInvoice;


		return {
			percentegeSpent,
			limit: userLimit,
			available,
			...invoice[0]
		};
	}
}