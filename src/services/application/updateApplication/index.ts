import { Application } from "@/@types/customTypes";
import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { hexValidator } from "@/utils/hexValidator";


export class UpdateApplication{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface
	){}


	async execute(applicationId: string, data: Application){
        
		const institution = data.institution ?? env.INSTITUTION;

		const { background, font} = await hexValidator(data.colorFont, data.colorApplication);


		if(data.targetValue <= 0){
			throw new DataValidationError("Informe um valor que deseja alcançar com esta aplicação.");
		}


		const application = await this.applicationRepository.update(
			applicationId,
			{
				name: data.name,
				target_value: data.targetValue,
				institution: institution,
				color_application: background,
				color_font: font,
				icon: data.icon,
			}
		);


		return application;
	}
}