import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makeGetAllCardInvoices } from "@/factories/invoice/make-getAllCardInvoices";
import { FastifyTypes } from "@/@types/fastify-customTypes";
import { checkToken } from "@/http/middlewares/checkToken";
import { Prisma } from "@/generated/prisma/client";


export async function getAllCardInvoices(app: FastifyTypes){

	app.get(
		"/getAllCardInvoices/:cardId",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				params: z.object({
					cardId: z.string()
				}),
				response: {
					200: z.object({
						invoices: z.array(z.object({
							invoiceId: z.string(),
							pay: z.boolean(),
							dueDate: z.date(),
							current: z.boolean(),
							amount: z.instanceof(Prisma.Decimal),
							installments: z.array(z.object({
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
						})),
						subtitles: z.array(z.object({
							invoiceId: z.string(),
							current: z.boolean(),
							pay: z.boolean(),
							label: z.string(),
						})),
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["invoice"],
				description: "This route is responsible for listing all invoices related to each credit card. "
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
				
				
				const serviceGetAllCardInvoices = makeGetAllCardInvoices();
				const invoices = await serviceGetAllCardInvoices.execute(
					request.userId,
					request.params.cardId
				);

				
				return reply.status(200).send(invoices);

			}catch(err){

				const { statusCode, error } = handleErrorsInControlles(err);
				return reply.status(statusCode).send(error);
			}
		}
	);
}