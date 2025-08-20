import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeGetApplication } from "@/factories/application/make-getApplication";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function getApplication(app: FastifyTypes){

	app.get(
		"/getApplication/:applicationId",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				params: z.object({
					applicationId: z.string()
				}),
				response: {
					200: z.object({
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
						extract: z.array(z.object({
							value: z.instanceof(Prisma.Decimal),
							type: z.string(),
							applicationId: z.string(),
							id: z.string(),
							createdAt: z.date()
						}))
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["application"],
				description: ""
			},
			preHandler: checkToken
		},
		async (request, reply) => {

			try{

				const params = z.object({
					applicationId: z.string()
				}).parse(request.params);


				const serviceGetApplication = makeGetApplication();
				const application = await serviceGetApplication.execute(params.applicationId);


				return reply.status(200).send(application);

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