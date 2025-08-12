import { makeUpdateCard } from "@/factories/card/make-updateCard";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function updateCard(request: FastifyRequest, reply: FastifyReply){

	try{

		const body = z.object({
			id: z.string(),
			name: z.string(),
			dueDay: z.number(),
			closingDay: z.number(),
			colorFont: z.string().nullable(),
			colorCard: z.string().nullable(),
		}).parse(request.body);


		const serviceUpdateCard = makeUpdateCard();
		const card = await serviceUpdateCard.execute(body);


		return reply.status(200).send(JSON.stringify(card));

	}catch(err: any){

		const { error, statusCode} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}