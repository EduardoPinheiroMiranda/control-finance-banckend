import { Application } from "@/@types/customTypes";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";


export class RegisterApplication{

	constructor(
        private applicationRepository: ApplicationDatabaseInterface
	){}


	async execute(data: Application){
        
        

	}
}