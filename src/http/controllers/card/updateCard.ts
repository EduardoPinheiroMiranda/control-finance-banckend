import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeUpdateCard } from "@/factories/card/make-updateCard";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function updateCard(app: FastifyTypes){

	app.put(
		"/updateCard",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					id: z.string(),
					name: z.string(),
					dueDay: z.number(),
					closingDay: z.number(),
					colorFont: z.string().nullable(),
					colorCard: z.string().nullable(),
				}),
				response: {
					200: z.object({ 
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
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["card"],
				description: "This route is responsible for updating the user's credit card data."
			},
			preHandler: checkToken
		},
		async (request, reply) => {

			try{

				const serviceUpdateCard = makeUpdateCard();
				const card = await serviceUpdateCard.execute(request.body);


				return reply.status(200).send(card);

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