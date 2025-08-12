import { makeListCards } from "@/factories/card/make-listCards";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function listCard(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
	

		const serviceListCard = makeListCards();
		const card = await serviceListCard.execute(userId);


		return reply.status(200).send(JSON.stringify(card));

	}catch(err: any){

		const { error, statusCode} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}