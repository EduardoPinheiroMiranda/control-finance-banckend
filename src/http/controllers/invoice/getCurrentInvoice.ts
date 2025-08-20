import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makeGetCurrentInvoice } from "@/factories/invoice/make-getCurrentInvoice";
import { FastifyTypes } from "@/@types/fastify-customTypes";
import { checkToken } from "@/http/middlewares/checkToken";


export async function getCurrentInvoice(app: FastifyTypes){

	app.get(
		"/getCurrentInvoice",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.object({
						invoiceId: z.string(),
						pay: z.boolean(),
						dueDate: z.date(),
						closingDate: z.date(),
						current: z.boolean(),
						amount: z.number(),
						limit: z.number(),
						available: z.number(),
						totalFixedExpense: z.number(),
						totalExtraExpense: z.number(),
						totalInvoice: z.number(),
						totalCard: z.number(),
						totalMoney: z.number(),
						percentageSpent: z.number(),
						installments: z.object({
							fixedExpense: z.array(z.object({
								installmentId: z.string(),
								installmentNumber: z.number(),
								installmentValue: z.number(),
								dueDate: z.string(),
								pay: z.boolean(),
								shoppingId: z.string(),
								totalInstallments: z.number(),
								typeInvoice: z.string(),
								paymentMethod: z.string(),
								name: z.string(),
								purchaseDate: z.string()
							})),
							extraExpense: z.array(z.object({
								installmentId: z.string(),
								installmentNumber: z.number(),
								installmentValue: z.number(),
								dueDate: z.string(),
								pay: z.boolean(),
								shoppingId: z.string(),
								totalInstallments: z.number(),
								typeInvoice: z.string(),
								paymentMethod: z.string(),
								name: z.string(),
								purchaseDate: z.string()
							}))
						})
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["invoice"],
				description: "This route is responsible for listing the user's current invoice. "
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

				
				const serviceGetCurrentInvoice = makeGetCurrentInvoice();
				const invoice = await serviceGetCurrentInvoice.execute(request.userId);

				
				return reply.status(200).send(invoice);

			}catch(err){

				const { statusCode, error } = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}