import { ResourceNotFoud } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";


export class ListCards{

	constructor(
        private cardRepository: CardDatabaseInterface
	){}


	async execute(userId: string){

		const allCards = await this.cardRepository.getAllCards(userId);
        
		if(allCards.length === 0){
			throw new ResourceNotFoud("Não foi encontrado nenhum cartão.");
		}

		return allCards;
	}
}