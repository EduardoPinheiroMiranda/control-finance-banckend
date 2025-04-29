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

		
	}
}