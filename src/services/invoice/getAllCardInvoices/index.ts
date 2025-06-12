import { DataValidationError } from "@/errors/custonErros";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { createSubtitleToInvoices } from "@/utils/createSubtitleToInvoices";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export class GetAllCardInvoices{

	constructor(
        private invoiceRepository: InvoiceDatabaseInterface,
		private userRepository: UserDatabaseInterface
	){}


	async execute(userId: string, cardId: string){

		const user = await this.userRepository.getById(userId);

		if(!user){
			throw new DataValidationError("Houve um problema para consultar as informações do usuário.");
		}


		const handlerDueDate = new HandlerDueDate();
		const dueDay = user.due_day;
		const closingDay = user.closing_day;
		const date = handlerDueDate.generateDueDates(dueDay, closingDay, 1, false);


		const invoices = await this.invoiceRepository.getAllCardInvoices(userId, cardId, date[0].dueDate);

		if(invoices.length === 0){
			throw new DataValidationError("Não foi encotrado faturas deste cartão.");
		}


		const subtitle = createSubtitleToInvoices(invoices);


		return {
			invoices,
			subtitle
		};
	}
}