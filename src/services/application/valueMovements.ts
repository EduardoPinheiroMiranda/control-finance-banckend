import { DataValidationError } from "@/errors/custonErros";
import { TypeExtract } from "@/generated/prisma/client";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { ExtractDatabaseInterface } from "@/repositories/interfaces/extract";


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

        
		const newTotalValue = type === "DEPOSIT" ? Number(application.value) + value : Number(application.value) - value;

        
		const [, registerMovement] = await Promise.all([
			this.applicationRepository.update(
				applicationId, { value: newTotalValue }
			),
			this.extractRepository.create({
				type: type === TypeExtract.DEPOSIT ? TypeExtract.DEPOSIT : TypeExtract.WITHDRAW,
				value: value,
				applicationId: applicationId
			})
		]);


		return {
			applicationId: application.id,
			totalValue: newTotalValue,
			type: registerMovement.type,
			value: registerMovement.value,
			createdAt: registerMovement.createdAt
		};
	}
}