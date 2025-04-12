import { User } from "@/@types/customTypes";
import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { hash } from "bcrypt";


export class RegisterUsers {

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userData: User) {

		const emailAlreadExist = await this.userRepository.findEmail(userData.email);

		if(emailAlreadExist){
			throw new DataValidationError("This email already exist.");
		}

		if(userData.dueDay > 31 || userData.dueDay < 1){
			throw new DataValidationError("The expiration day is invalid. Choose a period between days 1 to 31.");
		}

		if(userData.limit < 100){
			throw new DataValidationError("The limit is less than 100.");
		}

		if(userData.password.length < 8){
			throw new DataValidationError("Password is less than 8 characters long.");
		}

		
		const passwordHash = await hash(userData.password, 12);

		
		await this.userRepository.create({
			name: userData.name,
			email: userData.email,
			password: passwordHash,
			due_day: userData.dueDay,
			close_day: userData.closeDay,
			limit: userData.limit,
			balance: 0,
		});


		return "usuário registrado com sucesso!";
	}
}