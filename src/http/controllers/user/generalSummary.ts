import { makeGeneralSummary } from "@/factories/user/make-generalSummary";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function generalSummary(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);


		const serviceGeneralSummary = makeGeneralSummary();
		const data = await serviceGeneralSummary.execute(userId);


		return reply.status(200).send(JSON.stringify(data));

	}catch(err: any){

		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}