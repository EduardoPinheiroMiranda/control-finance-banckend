import { makeUpdateShopping } from "@/factories/shopping/make-updateShopping";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function updateShopping(request: FastifyRequest, reply: FastifyReply){

	try{

		const body = z.object({
			id: z.string(),
			name: z.string(),
			value: z.number(),
			description: z.string().nullable(),
			dueDay: z.number(),
			categoryId: z.string(),
		}).parse(request.body);


		const serviceupdateShopping = makeUpdateShopping();
		const shopping = await serviceupdateShopping.execute(body);

        
		return reply.status(200).send(JSON.stringify(shopping));

	}catch(err: any){
        
		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}