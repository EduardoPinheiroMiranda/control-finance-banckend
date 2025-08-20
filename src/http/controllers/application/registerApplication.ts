import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeRegisterApplication } from "@/factories/application/make-registerApplication";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function registerApplication(app: FastifyTypes){

	app.post(
		"/registerApplication",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					name: z.string(),
					targetValue: z.number(),
					institution: z.string().nullable(),
					colorFont: z.string().nullable(),
					colorApplication: z.string().nullable(),
					icon: z.string()
				}),
				response: {
					201: z.object({
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

				if(!request.userId){
					return reply.status(400).send({
						msg: "O usuário deve ser informado."
					});
				}


				const serviceRegisterApplication = makeRegisterApplication();
				const application = await serviceRegisterApplication.execute(
					request.userId,
					request.body
				);


				return reply.status(201).send(application);

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