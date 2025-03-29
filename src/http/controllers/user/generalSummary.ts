import { DataValidationError } from "@/errors/custonErros";
import { makeGeneralSummary } from "@/factories/user/make-generalSummary";
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

		if(err.name === "ZodError"){
			return reply.status(400).send(JSON.stringify({
				msg: "dados enviados incorreto, verifique a estrutura do objeto ou seus valores",
				err: err.errors
			}));
		}
		
		if(err instanceof DataValidationError){
			return reply.status(400).send(JSON.stringify({
				msg: err.message,
			}));
		}
		
		console.log(err);
		return reply.status(500).send(JSON.stringify({
			msg: "Error internal server",
		}));
	}
}