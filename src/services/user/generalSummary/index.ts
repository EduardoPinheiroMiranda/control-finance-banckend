import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class GeneralSummary{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(id: string){

		console.log(id);
	}
}