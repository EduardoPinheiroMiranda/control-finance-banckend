import { Application } from "@/@types/customTypes";
import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { hexValidator } from "@/utils/hexValidator";


export class RegisterApplication{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface
	){}


	async execute(userId: string, data: Application){
        
		const institution = data.institution ?? env.INSTITUTION;

		const { background, font} = await hexValidator(data.colorFont, data.colorApplication);


		if(data.targetValue <= 0){
			throw new DataValidationError("Informe um valor que deseja alcançar com esta aplicação.");
		}


		const application = await this.applicationRepository.create({
			name: data.name,
			target_value: data.targetValue,
			value: 0,
			institution: institution,
			color_font: font,
			color_application: background,
			icon: data.icon,
			user_id: userId
		});


		return application;
	}
}