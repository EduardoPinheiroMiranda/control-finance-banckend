import { makeDeleteShopping } from "@/factories/shopping/make-deleteShopping";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function deleteShopping(request: FastifyRequest, reply: FastifyReply){

	try{

		const params = z.object({
			shoppingId: z.string()
		}).parse(request.params);


		const serviceDeleteShopping = makeDeleteShopping();
		const shopping = await serviceDeleteShopping.execute(params.shoppingId);

        
		return reply.status(200).send(JSON.stringify(shopping));

	}catch(err: any){
        
		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}