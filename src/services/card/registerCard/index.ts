import { Card } from "@/@types/customTypes";
import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";


export class RegisterCard{

	constructor(
        private cardRepository: CardDatabaseInterface
	){}


	async execute(userId: string, data: Card){

		const colorCard = data.colorCard? data.colorCard : env.COLOR_FONT_DEFAULT;
		const colorFont = data.colorFont? data.colorFont : env.COLOR_FONT_DEFAULT;

        
		const regexValidationHexadecimal = /#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)/;
		const colorFontIsValid = regexValidationHexadecimal.test(colorCard);
		const colorCardIsValid = regexValidationHexadecimal.test(colorFont);


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
			color_card: colorCard,
			color_font: colorFont,
			user_id: userId
		});


		return card;
	}
}