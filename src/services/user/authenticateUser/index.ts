import { env } from "@/env";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";


export class AuthenticateUser{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(emial: string, password: string){

		const user = await this.userRepository.findEmail(emial);

		if(!user){
			throw new Error("Incorrect username or password.");
		}


		const checkPassword = await compare(password, user.password);

		if(!checkPassword){
			throw new Error("Incorrect username or password.");
		}

        
		const token = sign(
			{ userId: user.id},
			env.SECRET,
			{expiresIn: "30m"}
		);


		return {
			id: user.id,
			name: user.name,
			emial: user.email,
			token
		};
	}
}