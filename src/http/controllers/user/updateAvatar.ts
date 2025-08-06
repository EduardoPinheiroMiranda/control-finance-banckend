import { makeUpdateAvatar } from "@/factories/user/make-updateAvatar";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function updateAvatar(request: FastifyRequest, reply: FastifyReply){

	try{
        
		const userId = z.string().parse(request.headers["user-id"]);

		const scheme = z.object({
			avatar: z.string(),
		});


		const body = scheme.parse(request.body);


		const serviceUpdateAvatar = makeUpdateAvatar();
		const user = await serviceUpdateAvatar.execute(
			userId,
			body.avatar,
		);

        
		return reply.status(200).send(JSON.stringify(user));

	}catch(err: any){

		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}