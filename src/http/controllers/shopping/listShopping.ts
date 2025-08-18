import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeListShopping } from "@/factories/shopping/make-listShopping";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function listShopping(app: FastifyTypes){

	app.get(
		"/listShopping",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.object({
						fixedExpense: z.array(z.object({
							id: z.string(),
							name: z.string(),
							typeInvoice: z.string(),
							paymentMethod: z.string(),
							value: z.number(),
							totalInstallments: z.number(),
							pay: z.boolean(),
							description: z.string().nullable(),
							createdAt: z.string(),
							updatedAt: z.string(),
							cardId: z.string().nullable(),
							categoryId: z.string(),
							userId: z.string()
						})),
						extraExpense: z.array(z.object({
							id: z.string(),
							name: z.string(),
							typeInvoice: z.string(),
							paymentMethod: z.string(),
							value: z.number(),
							totalInstallments: z.number(),
							pay: z.boolean(),
							description: z.string().nullable(),
							createdAt: z.string(),
							updatedAt: z.string(),
							cardId: z.string().nullable(),
							categoryId: z.string(),
							userId: z.string()
						}))
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["shopping"],
				description: "This route is responsible for listing all purchases made."
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


				const serviceListShopping = makeListShopping();
				const shopping = await serviceListShopping.execute(request.userId);
			
	
				return reply.status(200).send(shopping);

			}catch(err: any){
				
				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}