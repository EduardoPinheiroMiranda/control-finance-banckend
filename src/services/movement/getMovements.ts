import { DataValidationError, ResourceNotFound } from "@/errors/custonErros";
import { MovementDatabaseInterface } from "@/repositories/interfaces/movement";


export class GetMovements{

	constructor(private MovementsRepository: MovementDatabaseInterface){}

	async execute(userId: string, cursor: number){

		if(cursor%10 !== 0){
			throw new DataValidationError("Você já chegou na ultima página.");
		}
        
		const movements = await this.MovementsRepository.getMovements(userId, cursor);

		if(movements.length === 0){
			throw new ResourceNotFound("Não foi encontrada nenhuma movimentação.");
		}

		return movements;
	}
}