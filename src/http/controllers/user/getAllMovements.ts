import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeGetAllMovements } from "@/factories/user/make-getAllMovements";
import { Prisma } from "@/generated/prisma";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function getAllMovements(app: FastifyTypes){

	app.post(
		"/getAllMovements",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					name: z.string().nullable(),
					cursor: z.string().nullable()
				}),
				response: {
					200: z.array(
						z.object({
							description: z.string().nullable(),
							value: z.instanceof(Prisma.Decimal),
							name: z.string(),
							id: z.string(),
							typeInvoice: z.enum(["FIXED_EXPENSE", "EXTRA_EXPENSE"]),
							paymentMethod: z.enum(["CARD", "INVOICE", "MONEY"]),
							totalInstallments: z.number(),
							pay: z.boolean(),
							createdAt: z.date(),
							updatedAt: z.date(),
							cardId: z.string().nullable(),
							categoryId: z.string(),
							userId: z.string(),
						}
						)),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for searching for all purchasing movements carried out"
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
        
				
				const serviceGetAllMovements = makeGetAllMovements();
				const movements = await serviceGetAllMovements.execute(
					request.userId,
					request.body.name,
					request.body.cursor,
				);

				
				return reply.status(200).send(movements);

			}catch(err){

				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);


	
}