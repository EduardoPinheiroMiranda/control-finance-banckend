import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makeGetAllInvoices } from "@/factories/invoice/make-getAllInvoices";
import { FastifyTypes } from "@/@types/fastify-customTypes";
import { checkToken } from "@/http/middlewares/checkToken";


export async function getAllInvoices(app: FastifyTypes){

	app.get(
		"/getAllInvoices",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.object({
						invoices: z.array(z.object({
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
				description: "This route is responsible for listing all of the user's invoices."
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

				
				const serviceGetAllInvoices = makeGetAllInvoices();
				const invoices = await serviceGetAllInvoices.execute(request.userId);

				
				return reply.status(200).send(invoices);

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