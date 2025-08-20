import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeRegisterUser } from "@/factories/user/make-registerUser";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function registerUser(app: FastifyTypes	){

	app.post(
		"/userRegister",
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string()
				}),
				response: {
					201: z.object({msg: z.string()}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This endpoint is responsible for registering a new user.",
			}
		},
		async (request, reply) => {

			try{

				const serviceRegisterUser = makeRegisterUser();
				await serviceRegisterUser.execute({
					name: request.body.name,
					email: request.body.email,
					password: request.body.password,
					limit: 1000,
					dueDay: 10,
					closeDay: 5
				});


				return reply.status(201).send({
					msg: "Usuário cadastrado com sucesso."
				});

			}catch(err){

				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}