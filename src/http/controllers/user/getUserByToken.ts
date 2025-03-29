import { DataValidationError } from "@/errors/custonErros";
import { makeGetUserById } from "@/factories/user/make-getUSerById";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function getUserByToken(request: FastifyRequest, reply: FastifyReply){

	try{

		const schema = z.string();
		const userId = schema.parse(request.headers["user-id"]);


		const serviceGetUserById = makeGetUserById();
		const user = await serviceGetUserById.execute(userId);


		return reply.status(200).send(JSON.stringify(user));

	}catch(err: any){
		
		if(err.name === "ZodError"){
			return reply.status(400).send(JSON.stringify({
				msg: "dados enviados incorreto, verifique a estrutura do objeto ou seus valores",
				err: err.errors
			}));
		}
		
		if(err instanceof DataValidationError){
			return reply.status(400).send(JSON.stringify({
				msg: err.message,
			}));
		}
		
		console.log(err);
		return reply.status(500).send(JSON.stringify({
			msg: "Error internal server",
		}));
		
	}
}