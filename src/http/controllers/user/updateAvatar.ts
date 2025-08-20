import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeUpdateAvatar } from "@/factories/user/make-updateAvatar";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function updateAvatar(app: FastifyTypes){

	app.put(
		"/updateAvatar",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					avatar: z.string(),
				}),
				response: {
					200: z.object({
						id: z.string(),
						name: z.string(),
						email: z.string(),
						avatar: z.string().nullable()
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for updating the user's avatar."
			},
			preHandler: checkToken
		},
		async (request, reply) => {

			try{

				if(!request.userId){
					return reply.status(400).send({
						msg: "O usuário deve ser informado."
					});
				}

        
				const serviceUpdateAvatar = makeUpdateAvatar();
				const user = await serviceUpdateAvatar.execute(
					request.userId,
					request.body.avatar,
				);

				
				return reply.status(200).send(user);

			}catch(err){

				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}