import { FastifyTypes } from "@/@types/fastify-customTypes";
import { makeGeneralSummary } from "@/factories/user/make-generalSummary";
import { Prisma } from "@/generated/prisma/client";
import { checkToken } from "@/http/middlewares/checkToken";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { z } from "zod";


export async function generalSummary(app: FastifyTypes){

	app.get(
		"/generalSummary",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				response: {
					200: z.object({
						applications: z.object({
							value: z.instanceof(Prisma.Decimal),
							applications: z.array(z.object({
								value: z.instanceof(Prisma.Decimal),
								name: z.string(),
								id: z.string(),
								targetValue: z.instanceof(Prisma.Decimal),
								institution: z.string(),
								colorFont: z.string(),
								colorApplication: z.string(),
								icon: z.string(),
								createdAt: z.date(),
								updatedAt: z.date(),
								userId: z.string(),
							}))
						}),
						invoice: z.object({
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
								extraExpense:  z.array(z.object({
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
							}),
							percentageSpent: z.number()
						}),
						cards: z.array(z.object({
							name: z.string(),
							id: z.string(),
							colorFont: z.string(),
							createdAt: z.date(),
							updatedAt: z.date(),
							userId: z.string(),
							dueDay: z.number(),
							closingDay: z.number(),
							colorCard: z.string(),
							active: z.boolean(),
						})),
						movements: z.array(z.object({
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
						})),
					}),
					400: z.object({msg: z.string()})
				},
				tags: ["user"],
				description: "This route is responsible for fetching all the main data related to the user such as values in applications, cards, transactions and personal data."
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


				const serviceGeneralSummary = makeGeneralSummary();
				const data = await serviceGeneralSummary.execute(request.userId);


				return reply.status(200).send(data);

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