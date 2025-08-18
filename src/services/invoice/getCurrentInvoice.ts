import { Invoice } from "@/@types/prisma-customTypes";
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

		
		const dueDay = user.dueDay;
		const closingDay = user.closingDay;
		const handlerDueDates = new HandlerDueDate();
		const date = handlerDueDates.generateDueDates(dueDay, closingDay, 1, false);


		const invoice = await this.invoiceRepository.getCurrentInvoice(userId, date[0].dueDate);

		

		if(invoice.length === 0 ){
			throw new DataValidationError("Sua fatura não foi encontrada.");
		}


		const limit = invoice[0].limit;
		const amountInvoice = invoice[0].amount;
		const percentegeSpent = Math.trunc((amountInvoice/limit)*100);
		

		const result: Invoice & {percentageSpent: number} = {
			...invoice[0],
			percentageSpent: percentegeSpent
		};

		return result;
	}
}