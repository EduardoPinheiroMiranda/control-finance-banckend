import { CardUpdate } from "@/@types/customTypes";
import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { env } from "@/env";
import { hexValidator } from "@/utils/hexValidator";


export class UpdateCard{

	constructor(
        private cardRepository: CardDatabaseInterface
	){}


	async execute(data: CardUpdate){

		const { background, font } = await hexValidator(data.colorFont, data.colorCard);


		if(data.dueDay > 31 || data.dueDay < 0 && data.closingDay > 31 || data.closingDay < 0){
			throw new DataValidationError("Verifique os valores de datas informados, dados invalidos.");
		}


		try{

			const card = await this.cardRepository.updateCartd(
				data.id,
				{
					name: data.name,
					due_day: data.dueDay,
					closing_day: data.closingDay,
					color_card: background,
					color_font: font,
				}
			);


			return card;

		}catch(err){
			if(env.NODE_ENV !== "test"){
				console.log(err);
			}
						
			throw new DataValidationError("Houve um erro ao tentar atualizar este cartão, tente novamente mais tarde.");
		}
	}
}