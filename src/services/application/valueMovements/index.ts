import { DataValidationError } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { ExtractDatabaseInterface } from "@/repositories/interfaces/extract";
import { typeExtract } from "@/utils/globalValues";


export class ValueMovements{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface,
        private extractRepository: ExtractDatabaseInterface
	){}


	async execute(applicationId: string, value: number, type: string){

		if(value < 0){
			throw new DataValidationError("O valor deve ser acima de 0.");
		}


		const application = await this.applicationRepository.getById(applicationId);

		if(!application){
			throw new DataValidationError("Houve um problema para realizar a sua ação, tente novamente mais tarde.");
		}

        
		const newTotalValue = type === typeExtract[0] ? Number(application.value) + value : Number(application.value) - value;

        
		const [, registerMovement] = await Promise.all([
			this.applicationRepository.update(
				applicationId, { value: newTotalValue }
			),
			this.extractRepository.create({
				type: type,
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