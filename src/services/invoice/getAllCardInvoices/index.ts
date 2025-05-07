import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export class GelAllCardInvoices{

	constructor(
        private invoiceRepository: InvoiceDatabaseInterface,
        private cardRepository: CardDatabaseInterface
	){}


	async execute(userId: string, cardId: string){

		const card = await this.cardRepository.getById(cardId);

		if(!card){
			throw new DataValidationError("Houve um problema para consultar as informações do cartão.");
		}


		const handlerDueDate = new HandlerDueDate();
		const dueDay = card.due_day;
		const closingDay = card.closing_day;
		const date = handlerDueDate.generateDueDates(dueDay, closingDay, 1, false);


		const invoices = await this.invoiceRepository.getAllCardInvoices(userId, cardId, date[0].dueDate);

		if(invoices.length === 0){
			throw new DataValidationError("Não foi encotrado faturas deste cartão.");
		}


		return invoices;
	}
}