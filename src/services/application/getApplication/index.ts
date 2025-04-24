import { ResourceNotFoud } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";


export class GetApplication{

	constructor(
        private applicationRepositoty: ApplicationDatabaseInterface
	){}


	async execute(applicationId: string){
        
		const application = await this.applicationRepositoty.getById(applicationId);

		if(!application){
			throw new ResourceNotFoud("Aplicação não foi encontrada.");
		}

		return application;
	}
}