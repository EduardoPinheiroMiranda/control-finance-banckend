import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { UserDatabaseInterface } from "@/repositories/interfaces/user";
import { hash, compare } from "bcrypt";


export class UpdatePassword{

	constructor(
        private userRepository: UserDatabaseInterface
	){}


	async execute(userId: string, password: string, newPassword: string){

		if(newPassword.length < 8){
			throw new DataValidationError("A nova senha tem que possuir 8 ou mais caracteres.");
		}


		const user = await this.userRepository.getById(userId);

		if(!user){
			throw new ResourceNotFoud("Usuário não encontrado.");
		}


		const passwordIsValid = await compare(password, user.password);

		if(!passwordIsValid){
			throw new DataValidationError("Senha atual invalida");
		}


		const encryptedPassword = await hash(newPassword, 12);

        
		const { id, name, email } = await this.userRepository.updatePassword(userId, encryptedPassword);
			
		return {
			id,
			name,
			email
		};
	}
}