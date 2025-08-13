import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export async function cardValidation(
	paymentMethod: string,
	cardId: string | null,
	cardRepository: CardDatabaseInterface
){

	let startOnTheInvoice = false;

    
	if(paymentMethod === "CARD"){
    
		if(!cardId){
			throw new DataValidationError("Cartão informado invalido.");
		}
    

		const card = await cardRepository.getById(cardId);
    
		if(!card){
			throw new DataValidationError("Cartão informado invalido.");
		}
    
       
		const handlerDueDate = new HandlerDueDate();
		const currentDate = new Date();

		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
    

		const closeDateTheCurrentMonth = handlerDueDate.formatDate(
			year,
			month,
			card.closingDay
		);
		
    
		if(currentDate.getTime() > closeDateTheCurrentMonth.getTime()){
			startOnTheInvoice = true;
		}


		return {
			startOnTheInvoice,
			dueDay: card.dueDay
		};
	}


	return {
		startOnTheInvoice,
		dueDay: null
	};
}