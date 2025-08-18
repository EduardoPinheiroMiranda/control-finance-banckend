import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makePayInvoice } from "@/factories/invoice/make-payInvoice";
import { FastifyTypes } from "@/@types/fastify-customTypes";
import { checkToken } from "@/http/middlewares/checkToken";
import { Prisma } from "@/generated/prisma/client";


export async function payInvoice(app: FastifyTypes){

	app.put(
		"/payInvoice",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				body: z.object({
					invoiceId: z.string(),
					installmentsToPay: z.array(z.string())
				}),
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
				description: "This route is responsible for making payment for each purchase that appears on the invoice. The callback is the current invoice. If the invoice is already closed and has been paid in full, the next invoice will be returned."
			},
			preHandler: checkToken
		},
		async (request, reply) => {

			try{

				if(!request.userId){
					return reply.status(400).send({
						msg: "O usuário deve ser informado."
					})
				}
				
				
				const servicePayInvoice = makePayInvoice();
				const invoice = await servicePayInvoice.execute(
					request.userId,
					request.body.invoiceId,
					request.body.installmentsToPay
				);

				
				return reply.status(200).send(invoice);

			}catch(err: any){

				const { statusCode, error } = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}