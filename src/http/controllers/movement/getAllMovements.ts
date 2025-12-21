import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeGetAllMovements } from "@/factories/movements/make-getAllMovements";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function getAllMovements(app: FastifyTypes){

	app.get(
		"/getAllMovements",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				querystring: z.object({
					cursor: z.string()
				}),
				response: {
					200:z.array(z.object({
						id: z.string(),
						name: z.string(),
						type: z.string(),
						value: z.instanceof(Prisma.Decimal),
						installment: z.number().nullable(),							
						createdAt: z.date(),
						userId: z.string(),
						shoppingId: z.string().nullable(),
						extractId: z.string().nullable(),
					})),
					400: z.object({msg: z.string()})
				},
				tags: ["movement"],
				description: "This route is responsible for listing the Movements that can be associated with a purchase. It is possible to pass the id of a category to perform pagination, in this situation the id must be that of the last category present in the last seEsta requisição é responsável por listar todas as movimentações financeiras do usuário, incluindo compras, depósitos e saques. Ela recebe um parâmetro chamado curso, do tipo number, que representa a quantidade de movimentações já exibidas na página. Basta informar o tamanho atual do array de movimentações para que a API retorne os próximos registros.arch performed."
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

				const serviceListMovements = makeGetAllMovements();
				const Movements = await serviceListMovements.execute(
					request.userId,
					Number(request.query.cursor)
				);


				return reply.status(200).send(Movements);

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