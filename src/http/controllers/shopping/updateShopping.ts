import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeUpdateShopping } from "@/factories/shopping/make-updateShopping";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function updateShopping(app: FastifyTypes){

	app.put(
		"/updateShopping",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					id: z.string(),
					name: z.string(),
					value: z.number(),
					description: z.string().nullable(),
					dueDay: z.number(),
					categoryId: z.string(),
				}),
				response: {
					200: z.object({msg: z.string().describe("Dados atualizados.")}),
					400: z.object({msg: z.string()})
				},
				tags: ["shopping"],
				description: "This route is responsible for updating data related to a purchase."
			}
		},
		async (request, reply) => {

			try{

				const serviceupdateShopping = makeUpdateShopping();
				await serviceupdateShopping.execute(request.body);

				
				return reply.status(200).send({msg: "Dados atualizados"});

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