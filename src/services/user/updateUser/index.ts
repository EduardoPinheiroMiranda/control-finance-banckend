import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class UpdateUser{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userId: string, name: string, email: string){

		const emailAlreadyExist = await this.userRepository.findEmail(email);

		if(emailAlreadyExist && emailAlreadyExist.id !== userId){
			throw new DataValidationError("Este email já existe.");
		}


		try{

			const user = await this.userRepository.update(userId, {name, email});
			
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				avatar: user.avatar
			};

		}catch(err){
            
			if(env.NODE_ENV !== "test"){
				console.log(err);
			}

			throw new DataValidationError("Houve um problema para realizar a tarefa, tente novamente.");
		}
	}
}