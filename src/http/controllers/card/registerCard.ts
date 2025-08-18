import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeRegisterCard } from "@/factories/card/make-registerCard";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function registerCard(app: FastifyTypes){

	app.post(
		"/registerCard",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					name: z.string(),
					dueDay: z.number(),
					closingDay: z.number(),
					colorFont: z.string().nullable(),
					colorCard: z.string().nullable(),
				}),
				response: {
					201: z.object({
						name: z.string(),
						dueDay: z.number(),
						closingDay: z.number(),
						colorFont: z.string(),
						colorCard: z.string(),
						id: z.string(),
						active: z.boolean(),
						createdAt: z.date(),
						updatedAt: z.date(),
						userId: z.string(),
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["card"],
				description: "This route is responsible for recording the user's credit card data."
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


				const serviceRegisterCard = makeRegisterCard();
				const card = await serviceRegisterCard.execute(
					request.userId,
					request.body
				);


				return reply.status(201).send(card);

			}catch(err: any){

				const { error, statusCode} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);

	
}