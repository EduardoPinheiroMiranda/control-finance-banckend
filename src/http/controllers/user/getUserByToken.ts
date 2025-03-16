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
		
		if(err.name === "Error"){

			return reply.status(204).send(JSON.stringify({
				msg: err.message
			}));

		}else{

			console.log(err);

			return reply.status(500).send(JSON.stringify({
				msg: "error internal server!"
			}));
		}
    
	}
}