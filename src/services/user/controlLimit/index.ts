import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class ControlLimit{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userId: string, limit: number, dueDay: number, closingDay: number){

		if(limit < 100){
			throw new DataValidationError("Verifique o valor do limite, ele não pode ser inferior a 100.");
		}

		if(dueDay < 1 || dueDay > 31){
			throw new DataValidationError("Dia de vencimento informado invalido.");
		}

		if(closingDay < 1 || closingDay > 31){
			throw new DataValidationError("Dia de fechamento informado invalido.");
		}

        
		try{

			const user = await this.userRepository.updateLimit(userId, limit, dueDay, closingDay);
			
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				dueDay: user.due_day,
				closingDay: user.closing_day,
				limit: user.limit,
			};

		}catch(err){
            
			if(env.NODE_ENV !== "test"){
				console.log(err);
			}

			throw new DataValidationError("Houve um problema para realizar a tarefa, tente novamente.");
		}
	}
}