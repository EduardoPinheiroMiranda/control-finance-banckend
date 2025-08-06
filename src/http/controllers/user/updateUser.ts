import { makeUpdateUser } from "@/factories/user/make-updateUser";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function updateUser(request: FastifyRequest, reply: FastifyReply){

	try{
        
		const userId = z.string().parse(request.headers["user-id"]);

		const scheme = z.object({
			name: z.string(),
			email: z.string()
		});


		const body = scheme.parse(request.body);


		const serviceUpdateUser = makeUpdateUser();
		const user = await serviceUpdateUser.execute(
			userId,
			body.name,
			body.email
		);

        
		return reply.status(200).send(JSON.stringify(user));

	}catch(err: any){

		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}