import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeGetAllApplications } from "@/factories/application/make-getAllApplications";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function getAllApplications(app: FastifyTypes){

	app.get(
		"/getAllApplications",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.object({
						value: z.instanceof(Prisma.Decimal),
						applications: z.array(z.object({
							value: z.instanceof(Prisma.Decimal),
							name: z.string(),
							id: z.string(),
							targetValue: z.instanceof(Prisma.Decimal),
							institution: z.string(),
							colorFont: z.string(),
							colorApplication: z.string(),
							icon: z.string(),
							createdAt: z.date(),
							updatedAt: z.date(),
							userId: z.string(),
						}))
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["application"],
				description: "This route is responsible for listing all the user's applications."
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


				const serviceGetAllApplications = makeGetAllApplications();
				const applications = await serviceGetAllApplications.execute(request.userId);


				return reply.status(200).send(applications);

			}catch(err){

				const { error, statusCode } = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}