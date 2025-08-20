import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeFilterApplications } from "@/factories/application/make-filterApplications";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function filterApplications(app: FastifyTypes){

	app.post(
		"/filterApplications",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					date: z.string().nullable(),
					applicationId: z.string().nullable(),
					type: z.enum(["DEPOSIT", "WITHDRAW"]).nullable()
				}),
				response: {
					200: z.object({
						amount: z.instanceof(Prisma.Decimal),
						extracts: z.array(z.object({
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
				description: "This route is responsible for searching the applications that the user has applying filters by date, type and id. "
			},
			preHandler: checkToken
		},
		async (request, reply) => {

			try{

				const serviceFilterApplications = makeFilterApplications();
				const applications = await serviceFilterApplications.execute(request.body);


				return reply.status(200).send(applications);

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