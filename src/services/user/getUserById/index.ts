import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class GetUserById{

	constructor(
        private userRepository: UserDatabaseInterface,
	){}


	async execute(userId: string){

		const user = await this.userRepository.getById(userId);
		
		if(!user){
			throw new DataValidationError("Usuário não encontrado.");
		}


		return { 
			id: user.id,
			name: user.name,
			email: user.email,
			limit: user.limit,
			expired: user.expired,
			avatar: user.avatar,
			balance: user.balance,
		};
	}
}