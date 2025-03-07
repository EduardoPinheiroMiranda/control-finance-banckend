import { UserDatabaseInterface } from "@/repositories/interfaces/user";


export class RegisterUsers {

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute() {
		console.log("vamos cadastrar um usuário????");

	}
}