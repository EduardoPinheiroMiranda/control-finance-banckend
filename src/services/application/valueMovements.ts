import { DataValidationError } from "@/errors/custonErros";
import { TypeExtract } from "@/generated/prisma/client";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { ExtractDatabaseInterface } from "@/repositories/interfaces/extract";
import { MovementDatabaseInterface } from "@/repositories/interfaces/movement";


interface Extract{
	type: TypeExtract,
	value: number,
	applicationId: string
}


export class ValueMovements{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface,
        private extractRepository: ExtractDatabaseInterface,
		private movementRepository: MovementDatabaseInterface
	){}


	calculateValue(type: string, value: number, currentValue: number){

		if(type === "DEPOSIT" || type === "INCOME"){
			return currentValue + value;
		}

		return currentValue - value;
	}


	async registerMovement(data: Extract, newTotalValue: number, userId: string){

		const [, extract] = await Promise.all([
			this.applicationRepository.update(data.applicationId, {value: newTotalValue}),
			this.extractRepository.create(data)
		]);

		await this.movementRepository.create({
			name: data.type,
			type: data.type,
			value: data.value,
			userId,
			extractId: extract.id
		});

		return extract;
	}

	async execute(applicationId: string, value: number, type: TypeExtract){

		if(value < 0){
			throw new DataValidationError("O valor deve ser acima de 0.");
		}


		const application = await this.applicationRepository.getById(applicationId);
		if(!application){
			throw new DataValidationError("Houve um problema para realizar a sua ação, tente novamente mais tarde.");
		}


		const currentValue = Number(application.value);
		const newTotalValue = this.calculateValue(type, value, currentValue);


		const extractData = { type: TypeExtract[type], value, applicationId };
		const result = await this.registerMovement(extractData, newTotalValue, application.userId);

		return {
			applicationId: application.id,
			totalValue: newTotalValue,
			type: result.type,
			value: result.value,
			createdAt: result.createdAt
		};
	}
}