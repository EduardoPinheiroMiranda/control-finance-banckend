import { makeUpdatePassword } from "@/factories/user/make-updatePassword";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function updatePassword(request: FastifyRequest, reply: FastifyReply){

	try{
        
		const userId = z.string().parse(request.headers["user-id"]);

		const scheme = z.object({
			password: z.string(),
			newPassword: z.string()
		});


		const body = scheme.parse(request.body);


		const serviceUpdatePassword = makeUpdatePassword();
		const user = await serviceUpdatePassword.execute(
			userId,
			body.password,
			body.newPassword
		);

        
		return reply.status(200).send(JSON.stringify(user));

	}catch(err: any){

		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}