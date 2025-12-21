import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeValueMovements } from "@/factories/application/make-valueMovements";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function valueMovements(app: FastifyTypes){

	app.post(
		"/valueMovements",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					applicationId: z.string(),
					value: z.number(),
					type: z.enum(["WITHDRAW", "DEPOSIT"]).default("DEPOSIT")
				}),
				response: {
					200: z.object({
						applicationId: z.string(),
						totalValue: z.number(),
						type: z.string(),
						value: z.instanceof(Prisma.Decimal),
						createdAt: z.date(),
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

				const serviceValueMovements = makeValueMovements();
				const application = await serviceValueMovements.execute(
					request.body.applicationId,
					request.body.value,
					request.body.type
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