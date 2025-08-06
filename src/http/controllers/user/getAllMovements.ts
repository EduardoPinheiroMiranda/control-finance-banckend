import { makeGetAllMovements } from "@/factories/user/make-getAllMovements";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function getAllMovements(request: FastifyRequest, reply: FastifyReply){

	try{
        
		const userId = z.string().parse(request.headers["user-id"]);

		const scheme = z.object({
			name: z.string().nullable(),
			cursor: z.string().nullable()
		});


		const body = scheme.parse(request.body);


		const serviceGetAllMovements = makeGetAllMovements();
		const user = await serviceGetAllMovements.execute(
			userId,
			body.name,
			body.cursor,
		);

        
		return reply.status(200).send(JSON.stringify(user));

	}catch(err: any){

		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}