import { env } from "src/env";
import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "oldCode/src/repositories/interfaces/card";


export class DisableCard{

	constructor(
        private cardRepository: CardDatabaseInterface
	){}


	async execute(cardId: string){
        
		try{

			const disableCard = await this.cardRepository.disable(cardId);
			return disableCard;

		}catch(err){
			if(env.NODE_ENV !== "test"){
				console.log(err);
			}
			
			throw new DataValidationError("Houve um erro ao tentar desativar este cartão, tente novamente mais tarde.");
		}
	}
}