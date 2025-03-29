import { makeAuthenticateUser } from "@/factories/user/make-authenticateUser";
import { hendleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function authenticateUser(request: FastifyRequest, reply: FastifyReply){

	try{

		const scheme = z.object({
			email: z.string(),
			password: z.string()
		});

		const body = scheme.parse(request.body);


		const serviceAuthenticateUser = makeAuthenticateUser();
		const user = await serviceAuthenticateUser.execute(
			body.email,
			body.password
		);

        
		return reply.status(200).send(JSON.stringify(user));

	}catch(err: any){

		const {statusCode, error} = hendleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}