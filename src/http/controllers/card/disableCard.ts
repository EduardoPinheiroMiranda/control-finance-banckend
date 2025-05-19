import { makeDisableCard } from "@/factories/card/make-disableCard";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function disableCard(request: FastifyRequest, reply: FastifyReply){

	try{

		const params = z.object({
			cardId: z.string()
		}).parse(request.params);
    

		const serviceDisableCard = makeDisableCard();
		const card = await serviceDisableCard.execute(params.cardId);


		return reply.status(200).send(JSON.stringify(card));

	}catch(err: any){

		const { error, statusCode} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}