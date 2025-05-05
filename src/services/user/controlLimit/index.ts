import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class ControlLimit{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userId: string, limit: number | null, dueDay: number | null){

		if(limit && limit < 100){
			throw new DataValidationError("Verifique o valor do limite, ele não pode ser inferior a 100.");
		}

		if(dueDay && (dueDay < 1 || dueDay > 31)){
			throw new DataValidationError("Data informada invalida.");
		}
        
		try{

			const user = await this.userRepository.updateLimit(userId, limit, dueDay);
			return user;

		}catch(err){
			console.log(err);
			throw new DataValidationError("Houve um problema para realizar a tarefa, tente novamente.");
		}
	}
}