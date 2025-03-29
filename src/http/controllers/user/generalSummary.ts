import { makeGeneralSummary } from "@/factories/user/make-generalSummary";
import { hendleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function generalSummary(request: FastifyRequest, reply: FastifyReply){

	try{

		const scheme = z.object({user_id: z.string()});
		const { user_id } = scheme.parse(request.params);


		const serviceGeneralSummary = makeGeneralSummary();
		const data = await serviceGeneralSummary.execute(user_id);

		return reply.status(200).send(JSON.stringify(data));

	}catch(err: any){

		const {statusCode, error} = hendleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}