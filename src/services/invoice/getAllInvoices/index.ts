import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { InvoiceDatabaseInterface } from "@/repositories/interfaces/invoice";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export class GetAllInvoices{

	constructor(
		private userRepository: UserDatabaseInterface,
        private invoiceRepository: InvoiceDatabaseInterface
	){}


	async execute(userId: string){

		const user = await this.userRepository.getById(userId);

		if(!user){
			throw new DataValidationError("Houve um problema ao buscar suas faturas, tente novamente.");
		}


		const dueDay = user.due_day;
		const closingDay = user.closing_day;
		const handlerDueDate = new HandlerDueDate();
		const dates = handlerDueDate.generateDueDates(dueDay, closingDay, 1, false);


		const invoices = await this.invoiceRepository.getAllInvoices(userId, dates[0].dueDate);

		if(invoices.length === 0){
			throw new ResourceNotFoud("Nenhuma fatura encontrada.");
		}


		return invoices;
	}
}