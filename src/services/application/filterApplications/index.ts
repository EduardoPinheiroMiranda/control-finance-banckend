import { Filter } from "@/@types/customTypes";
import { ResourceNotFoud } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";


export class FilterAllApplications{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface
	){}


	async execute(filter: Filter){

		const movements = await this.applicationRepository.filterApplications(filter);

		if(movements.extracts.length === 0){
			throw new ResourceNotFoud("Ainda não há movimentação de aplicações.");
		}

		return movements;
	}
}