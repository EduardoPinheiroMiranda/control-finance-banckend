import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeRegisterShopping } from "@/factories/shopping/make-registerShopping";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function registerShopping(app: FastifyTypes){

	app.post(
		"/registerShopping",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					name: z.string(),
					typeInvoice: z.enum(["FIXED_EXPENSE", "EXTRA_EXPENSE"]),
					paymentMethod: z.enum(["INVOICE", "CARD", "MONEY"]),
					value: z.number(),
					totalInstallments: z.number(),
					description: z.string().nullable(),
					dueDay: z.number().nullable(),
					categoryId: z.string(),
					cardId: z.string().nullable(),
					purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
						message: "A data deve estar no formato 'YYYY-MM-DD'",
					}).nullable()
				}),
				response: {
					201: z.object({msg: z.string().describe("Compra adicionada.")}),
					400: z.object({msg: z.string()})
				},
				tags: ["shopping"],
				description: "This route is responsible for recording purchases made by the user and, in addition, creating and populating the invoices that must include these purchases. When the purchase date is provided, a validation process intelligently allocates the installments to the appropriate invoices, ensuring security and consistency in the registration. For example: imagine a purchase of a product in 10 installments on a credit card, made on 05/15/2025, but the user registers this purchase only on 08/20/2025, that is, three months later. In this scenario, the system will determine which installments have theoretically already been paid, considering that some are past their due date. As a result, only installments 4 to 10 will be recorded."
			},
			preHandler: checkToken,
		},
		async (request, reply) => {

			try{

				if(!request.userId){
					return reply.status(400).send({
						msg: "O usuário deve ser informado."
					})
				}


				const serviceRegisterShopping = makeRegisterShopping();
				await serviceRegisterShopping.execute(
					request.userId,
					request.body
				);

				
				return reply.status(201).send({
					msg: "Compra adicionada."
				});

			}catch(err: any){
				
				const {statusCode, error} = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}