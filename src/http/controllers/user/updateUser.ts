import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeUpdateUser } from "@/factories/user/make-updateUser";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function updateUser(app: FastifyTypes){

	app.put(
		"/updateUser",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					name: z.string(),
					email: z.string().email()
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
				description: "This router is responsible for updating the user informations."
			},
			preHandler: checkToken,
		},
		async (request, reply) => {

			try{
				
				if(!request.userId){
					return reply.status(400).send({
						msg: "O usuário deve ser informado."
					});
				}
        

				const serviceUpdateUser = makeUpdateUser();
				const user = await serviceUpdateUser.execute(
					request.userId,
					request.body.name,
					request.body.email
				);

				
				return reply.status(200).send(user);

			}catch(err: any){

				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}