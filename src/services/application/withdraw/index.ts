import { DataValidationError } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { ExtractDatabaseInterface } from "@/repositories/interfaces/extract";
import { typeExtract } from "@/utils/globalValues";


export class Withdraw{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface,
        private extractRepository: ExtractDatabaseInterface
	){}


	async execute(applicationId: string, value: number){

		if(value < 0){
			throw new DataValidationError("O valor do saque deve ser acima de 0.");
		}


		const application = await this.applicationRepository.getById(applicationId);

		if(!application){
			throw new DataValidationError("Não foi possível sacar o valor que deseja, tente novamente mais tarde.");
		}

        
		const newTotalValue = Number(application.value) - value;

        
		const [, registerMovement] = await Promise.all([
			this.applicationRepository.update(
				applicationId, { value: newTotalValue }
			),
			this.extractRepository.create({
				type: typeExtract[1],
				value: value,
				application_id: applicationId
			})
		]);


		return {
			applicationId: application.id,
			totalValue: newTotalValue,
			type: registerMovement.type,
			value: registerMovement.value,
			createdAt: registerMovement.created_at
		};
	}
}