import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeGetUserById } from "@/factories/user/make-getUserById";
import { Prisma } from "@/generated/prisma";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function getUserByToken(app: FastifyTypes){

	app.get(
		"/getUserByToken",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.object({
						id: z.string(),
						name: z.string(),
						email: z.string(),
						limit: z.instanceof(Prisma.Decimal),
						dueDay: z.number(),
						closeDay: z.number(),
						avatar: z.string().nullable()
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for searching for a user based on their token"
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


				const serviceGetUserById = makeGetUserById();
				const user = await serviceGetUserById.execute(request.userId);


				return reply.status(200).send(user);

			}catch(err: unknown){

				if(err instanceof Error){
					const { error, statusCode } = handleErrorsInControlles(err);
					return reply.status(statusCode).send(error);
				}


				console.log(err);
				return reply.status(500).send({msg: "Error internal server"});	
			}
		}
	);
}