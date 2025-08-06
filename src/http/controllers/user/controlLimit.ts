import { makeControlLimit } from "@/factories/user/make-controlLimit";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function controlLimit(request: FastifyRequest, reply: FastifyReply){

	try{
        
		const userId = z.string().parse(request.headers["user-id"]);

		const scheme = z.object({
			limit: z.number(),
			dueDay: z.number(),
			closingDay: z.number()
		});


		const body = scheme.parse(request.body);


		const serviceControlLimit = makeControlLimit();
		const user = await serviceControlLimit.execute(
			userId,
			body.limit,
			body.dueDay,
			body.closingDay
		);

        
		return reply.status(200).send(JSON.stringify(user));

	}catch(err: any){

		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}