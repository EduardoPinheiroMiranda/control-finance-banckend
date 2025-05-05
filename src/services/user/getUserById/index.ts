import { ResourceNotFoud } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class GetUserById{

	constructor(
        private userRepository: UserDatabaseInterface,
	){}


	async execute(userId: string){

		const user = await this.userRepository.getById(userId);
		
		if(!user){
			throw new ResourceNotFoud("Usuário não encontrado.");
		}


		return { 
			id: user.id,
			name: user.name,
			email: user.email,
			limit: user.limit,
			dueDay: user.due_day,
			closeDay: user.closing_day,
			avatar: user.avatar,
		};
	}
}