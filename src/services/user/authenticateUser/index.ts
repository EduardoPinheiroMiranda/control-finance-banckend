import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";


export class AuthenticateUser{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(emial: string, password: string){

		const user = await this.userRepository.findEmail(emial);

		if(!user || user.email !== emial){
			throw new DataValidationError("Email ou senha inválidos.");
		}


		const checkPassword = await compare(password, user.password);

		if(!checkPassword){
			throw new DataValidationError("Email ou senha inválidos.");
		}

        
		const token = jwt.sign(
			{ userId: user.id},
			env.SECRET,
			{expiresIn: "1h"}
		);


		return {
			id: user.id,
			name: user.name,
			email: user.email,
			token,
			avatar: user.avatar
		};
	}
}