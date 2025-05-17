import { makeRegisterShopping } from "@/factories/shopping/make-registerShopping";
import { typeInvoices } from "@/utils/globalValues";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function registerShopping(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);

		const scheme = z.object({
			name: z.string(),
			typeInvoice: z.enum(typeInvoices),
			paymentMethod: z.string(),
			value: z.number(),
			totalInstallments: z.number(),
			description: z.string().nullable(),
			dueDay: z.number(),
			categoryId: z.string(),
			cardId: z.string().nullable(),
			purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
				message: "A data deve estar no formato 'YYYY-MM-DD'",
			}).nullable()
		});

		const shopping = scheme.parse(request.body);


		const serviceRegisterShopping = makeRegisterShopping();
		await serviceRegisterShopping.execute(userId, shopping);

		
		return reply.status(201).send(JSON.stringify({
			msg: "compra adicionada"
		}));

	}catch(err: any){
		
		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}