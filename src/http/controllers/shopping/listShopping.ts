import { makeListShopping } from "@/factories/shopping/make-listShopping";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function listShopping(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);


		const serviceListShopping = makeListShopping();
		const shopping = await serviceListShopping.execute(userId);

        
		return reply.status(200).send(JSON.stringify(shopping));

	}catch(err: any){
        
		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}