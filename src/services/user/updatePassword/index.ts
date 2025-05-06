import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { hash } from "bcrypt";


export class UpdatePassword{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userId: string, password: string){

		if(password.length < 8){
			throw new DataValidationError("A senha tem que possuir 8 ou mais caracteres.");
		}


		const encryptedPassword = await hash(password, 12);

        
		try{

			const user = await this.userRepository.updatePassword(userId, encryptedPassword);
			
			return {
				id: user.id,
				name: user.name,
				email: user.email
			};

		}catch(err){
            
			if(env.NODE_ENV !== "test"){
				console.log(err);
			}

			throw new DataValidationError("Houve um problema para realizar a tarefa, tente novamente.");
		}
	}
}