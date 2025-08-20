import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeUpdateApplication } from "@/factories/application/make-updateApplication";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function updateApplication(app: FastifyTypes){

	app.put(
		"/updateApplication",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					id: z.string(),
					name: z.string(),
					targetValue: z.number(),
					institution: z.string().nullable(),
					colorFont: z.string().nullable(),
					colorApplication: z.string().nullable(),
					icon: z.string()
				}),
				response: {
					200: z.object({
						value: z.instanceof(Prisma.Decimal),
						id: z.string(),
						name: z.string(),
						targetValue: z.instanceof(Prisma.Decimal),
						institution: z.string(),
						colorFont: z.string(),
						colorApplication: z.string(),
						icon: z.string(),
						createdAt: z.date(),
						updatedAt: z.date(),
						userId: z.string(),
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

				const serviceUpdateApplication = makeUpdateApplication();
				const application = await serviceUpdateApplication.execute(
					request.body.id,
					{
						name: request.body.name,
						targetValue: request.body.targetValue,
						institution: request.body.institution,
						colorFont: request.body.colorFont,
						colorApplication: request.body.colorApplication,
						icon: request.body.icon
					}
				);


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