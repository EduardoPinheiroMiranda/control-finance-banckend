import { CardUpdate } from "@/@types/customTypes";
import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";


export class UpdateCard{

	constructor(
        private cardRepository: CardDatabaseInterface
	){}


	async execute(data: CardUpdate){

		try{

			const regexValidationHexadecimal = /#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)/;
			const colorFontIsValid = regexValidationHexadecimal.test(data.colorCard);
			const colorCardIsValid = regexValidationHexadecimal.test(data.colorFont);


			if(!colorCardIsValid || !colorFontIsValid){
				throw new DataValidationError("Valores hexadecimais informados inválidos, corrija para prosseguir com o processo. ");
			}


			if(data.dueDay > 31 || data.dueDay < 0 && data.closingDay > 31 || data.closingDay < 0){
				throw new DataValidationError("Verifique os valores de datas informados, dados invalidos.");
			}


			const card = await this.cardRepository.updateCartd(
				data.id,
				{
					name: data.name,
					due_day: data.dueDay,
					closing_day: data.closingDay,
					color_card: data.colorCard,
					color_font: data.colorFont,
				}
			);


			return card;

		}catch(err){
			console.log(err);
			throw new DataValidationError("Houve um erro ao tentar atualizar este cartão, tente novamente mais tarde.");
		}
	}
}