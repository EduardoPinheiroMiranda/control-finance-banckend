import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeControlLimit } from "@/factories/user/make-controlLimit";
import { Prisma } from "@/generated/prisma";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function controlLimit(app: FastifyTypes){

	app.put(
		"/controlLimit",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					limit: z.number(),
					dueDay: z.number(),
					closingDay: z.number()
				}),
				response: {
					200: z.object({
						id: z.string(),
						name: z.string(),
						email: z.string(),
						dueDay: z.number(),
						closingDay: z.number(),
						limit: z.instanceof(Prisma.Decimal)
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for updating data related to the limit that the user can spend, such as the limit, closing and expiration dates of their accounts."
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


				const serviceControlLimit = makeControlLimit();
				const user = await serviceControlLimit.execute(
					request.userId,
					request.body.limit,
					request.body.dueDay,
					request.body.closingDay
				);

				
				return reply.status(200).send(user);

			}catch(err: any){

				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}