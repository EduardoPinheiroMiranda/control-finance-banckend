import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeAuthenticateUser } from "@/factories/user/make-authenticateUser";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function authenticateUser(app: FastifyTypes){

	app.post(
		"/authenticate", 
		{
			schema: {
				body: z.object({
					email: z.string(),
					password: z.string()
				}),
				response: {
					200: z.object({
						id: z.string(),
						name: z.string(),
						email: z.string().email(),
						token: z.string(),
						avatar: z.string().nullable()
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for authenticating the user based on their access credentials.",
			} 
		},
		async (request, reply) => {

			try{

				const serviceAuthenticateUser = makeAuthenticateUser();
				const user = await serviceAuthenticateUser.execute(
					request.body.email,
					request.body.password
				);

				
				return reply.status(200).send(user);

			}catch(err: any){

				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}