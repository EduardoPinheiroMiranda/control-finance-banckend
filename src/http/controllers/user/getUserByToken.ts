import { makeGetUserById } from "@/factories/user/make-getUSerById";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
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
		
		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}