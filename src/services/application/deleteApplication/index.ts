import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";


export class DeleteApplication{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface
	){}


	async execute(applicationId: string){

		try{

			const application = await this.applicationRepository.delete(applicationId);
			return application;

		}catch(err){

			if(env.NODE_ENV !== "test"){
				console.log(err);
			}

			throw new DataValidationError("Não foi possível apagar sua aplicação, tente novamente mais tarde.");
		}
	}
}