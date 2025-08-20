import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeDeleteShopping } from "@/factories/shopping/make-deleteShopping";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function deleteShopping(app: FastifyTypes){

	app.delete(
		"/deleteShopping/:shoppingId",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				params: z.object({
					shoppingId: z.string()
				}),
				response: {
					200: z.object({msg: z.string().describe("Compra deletada.")}),
					400: z.object({msg: z.string()})
				},
				tags: ["shopping"],
				description: "This route is responsible for deleting a purchase."
			}
		},
		async (request, reply) => {

			try{

				const serviceDeleteShopping = makeDeleteShopping();
				const shopping = await serviceDeleteShopping.execute(request.params.shoppingId);

				
				return reply.status(200).send(shopping);

			}catch(err){
				
				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}