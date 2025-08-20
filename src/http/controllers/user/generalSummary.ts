import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeGeneralSummary } from "@/factories/user/make-generalSummary";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function generalSummary(app: FastifyTypes){

	app.get(
		"/generalSummary",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.object({
						applications: z.object({}),
						invoice: z.object({}),
						cards: z.object({}),
						movements: z.object({})
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for fetching all the main data related to the user such as values in applications, cards, transactions and personal data."
			},
			preHandler: checkToken,
		},
		async (request, reply) => {

			try{

				if(!request.userId){
					return reply.status(400).send({
						msg: "O usuário deve ser informado."
					});
				}


				const serviceGeneralSummary = makeGeneralSummary();
				const data = await serviceGeneralSummary.execute(request.userId);


				return reply.status(200).send(data);

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