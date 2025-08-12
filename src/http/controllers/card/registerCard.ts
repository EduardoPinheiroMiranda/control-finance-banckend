import { makeRegisterCard } from "@/factories/card/make-registerCard";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function registerCard(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
		const body = z.object({
			name: z.string(),
			dueDay: z.number(),
			closingDay: z.number(),
			colorFont: z.string().nullable(),
			colorCard: z.string().nullable(),
		}).parse(request.body);


		const serviceRegisterCard = makeRegisterCard();
		const card = await serviceRegisterCard.execute(userId, body);


		return reply.status(201).send(JSON.stringify(card));

	}catch(err: any){

		const { error, statusCode} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}