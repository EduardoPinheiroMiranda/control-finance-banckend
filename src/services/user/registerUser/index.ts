import { User } from "@/@types/customTypes";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { getDateNow } from "@/utils/getDateNow";
import { hash } from "bcrypt";


export class RegisterUsers {

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userData: User) {

		const emailAlreadExist = await this.userRepository.findEmail(userData.email);


		if(emailAlreadExist){
			throw new Error("This email already exist.");
		}

		if(userData.expired > 31 || userData.expired < 1){
			throw new Error("The expiration day is invalid. Choose a period between days 1 to 28.");
		}

		if(userData.limit < 100){
			throw new Error("The limit is less than 100.");
		}

		if(userData.password.length < 8){
			throw new Error("Password is less than 8 characters long.");
		}

		
		const passwordHash = await hash(userData.password, 12);

		
		const user = await this.userRepository.create({
			name: userData.name,
			email: userData.email,
			password: passwordHash,
			expired: userData.expired,
			limit: userData.limit,
			balance: 0,
			updated_at: getDateNow,
			created_at: getDateNow
		});


		return {
			id: user.id,
			name: user.name,
			email: user.email,
			balance: user.balance
		};
	}
}