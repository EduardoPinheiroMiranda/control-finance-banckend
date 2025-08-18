import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeDisableCard } from "@/factories/card/make-disableCard";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function disableCard(app: FastifyTypes){

	app.put(
		"/disableCard/:cardId",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				params: z.object({
					cardId: z.string()
				}),
				response: {
					200: z.object({msg: z.string().describe("Cartão excluido.")}),
					400: z.object({msg: z.string()}),
				},
				tags: ["card"],
				description: "This route is responsible for disabling a card, but for the user it will be as if the card had been deleted."
			}
		},
		async (request, reply) => {

			try{

				const params = z.object({
					cardId: z.string()
				}).parse(request.params);
			

				const serviceDisableCard = makeDisableCard();
				const card = await serviceDisableCard.execute(params.cardId);


				return reply.status(200).send({msg: "Cartão excluido."});

			}catch(err: any){

				const { error, statusCode} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}