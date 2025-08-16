import { ResourceNotFoud } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";


export class GetAllApplications{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface
	){}


	async execute(userId: string){

		const application = await this.applicationRepository.getAllApllications(userId);

		if(application.applications.length === 0){
			throw new ResourceNotFoud("Não foi encontrada nenhuma aplicação ainda.");
		}

		return application;
	}
}