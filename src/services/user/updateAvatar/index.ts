import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class UpdateAvatar{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userId: string, avatar: string){

		try{

			const user = await this.userRepository.update(userId, {avatar});
			
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