import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeListCards } from "@/factories/card/make-listCards";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function listCard(app: FastifyTypes){

	app.get(
		"/listCard",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.array(z.object({
						name: z.string(),
						id: z.string(),
						dueDay: z.number(),
						closingDay: z.number(),
						colorFont: z.string(),
						colorCard: z.string(),
						active: z.boolean(),
						createdAt: z.date(),
						updatedAt: z.date(),
						userId: z.string(),
					})),
					400: z.object({msg: z.string()})
				},
				tags: ["card"],
				description: "This route is responsible for listing all the cards that the user has registered."
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
			

				const serviceListCard = makeListCards();
				const card = await serviceListCard.execute(request.userId);


				return reply.status(200).send(card);

			}catch(err){

				const { error, statusCode} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}