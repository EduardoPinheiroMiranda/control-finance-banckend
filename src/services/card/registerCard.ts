import { Card } from "src/@types/customTypes";
import { DataValidationError } from "@/errors/custonErros";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { hexValidator } from "@/utils/hexValidator";


export class RegisterCard{

	constructor(
        private cardRepository: CardDatabaseInterface
	){}


	async execute(userId: string, data: Card){

		const { background, font } = await hexValidator(data.colorFont, data.colorCard);


		if(data.dueDay > 31 || data.dueDay < 0 && data.closingDay > 31 || data.closingDay < 0){
			throw new DataValidationError("Verifique os valores de datas informados, dados invalidos.");
		}


		const card = await this.cardRepository.create({
			name: data.name,
			dueDay: data.dueDay,
			closingDay: data.closingDay,
			colorCard: background,
			colorFont: font,
			userId: userId
		});


		return card;
	}
}