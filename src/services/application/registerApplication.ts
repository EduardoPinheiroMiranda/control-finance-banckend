import { Application } from "src/@types/customTypes";
import { env } from "src/env";
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
			targetValue: data.targetValue,
			value: 0,
			institution: institution,
			colorFont: font,
			colorApplication: background,
			icon: data.icon,
			userId: userId
		});


		return application;
	}
}