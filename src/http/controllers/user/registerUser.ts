import { makeRegisterUser } from "@/factories/user/make-registerUser";
import { FastifyReply, FastifyRequest } from "fastify";


export async function registerUser(request: FastifyRequest, reply: FastifyReply){

	try{

		const serviceRegisterUser = makeRegisterUser();
		await serviceRegisterUser.execute();

        
	}catch(err: any){
		console.log(err);
	}
}