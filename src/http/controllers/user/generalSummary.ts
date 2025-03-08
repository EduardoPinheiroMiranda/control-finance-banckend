import { makeGeneralSummary } from "@/factories/user/make-generalSummary";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function generalSummary(request: FastifyRequest, reply: FastifyReply){

	try{

		const scheme = z.object({user_id: z.string()});
		const { user_id } = scheme.parse(request.params);


		const serviceGeneralSummary = makeGeneralSummary();
		const data = await serviceGeneralSummary.execute(user_id);

		reply.status(200).send(JSON.stringify(data));

	}catch(err: any){

		console.log(err);
		reply.status(500).send(JSON.stringify({
			msg: "error internal server!"
		}));
	}
}