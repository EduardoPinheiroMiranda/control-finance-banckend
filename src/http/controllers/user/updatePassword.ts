import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeUpdatePassword } from "@/factories/user/make-updatePassword";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function updatePassword(app: FastifyTypes){

	app.put(
		"/updatePassword",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					password: z.string(),
					newPassword: z.string()
				}),
				response: {
					200: z.object({
						id: z.string(),
						name: z.string(),
						email: z.string(),
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for updating the user's password."
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


				const serviceUpdatePassword = makeUpdatePassword();
				const user = await serviceUpdatePassword.execute(
					request.userId,
					request.body.password,
					request.body.newPassword
				);

				
				return reply.status(200).send(user);

			}catch(err){

				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}