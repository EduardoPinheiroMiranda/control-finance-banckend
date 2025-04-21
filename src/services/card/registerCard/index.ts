import { Card } from "@/@types/customTypes";
import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";


export class RegisterCard{

	constructor(
        private cardRepository: CardDatabaseInterface
	){}


	async execute(userId: string, data: Card){
        
		const regexValidationHexadecimal = /#([a-f0-9]{6})/;

		const colorFontIsValid = regexValidationHexadecimal.test(data.colorFont);
		const colorCardIsValid = regexValidationHexadecimal.test(data.colorCard);


		if(!colorCardIsValid || !colorFontIsValid){
			throw new DataValidationError("Valores hexadecimais informados inválidos, corrija para prosseguir com o processo. ");
		}


		if(data.dueDay > 31 || data.dueDay < 0 && data.closingDay > 31 || data.closingDay < 0){
			throw new DataValidationError("Verifique os valores de datas informados, dados invalidos.");
		}


		const card = await this.cardRepository.create({
			name: data.name,
			due_day: data.dueDay,
			closing_day: data.closingDay,
			color_card: data.colorCard,
			color_font: data.colorFont,
			user_id: userId
		});


		return card;
	}
}