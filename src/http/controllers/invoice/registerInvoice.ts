import { makeRegisterInvoice } from "@/factories/invoice/make-registerInvoice";
import { paymentMethods, typeInvoices } from "@/utils/globalValues";
import { handleErrorsInControlles } from "@/utils/handleErrorsInControllers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function registerInvoice(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
        
		const scheme = z.object({
			name: z.string(),
			typeInvoice: z.enum(typeInvoices),
			paymentMethod: z.enum(paymentMethods),
			value: z.number(),
			expired: z.string(),
			description: z.string(),
			numberOfInstallments: z.number(),
		});

		const body = scheme.parse(request.body);


		const serviceRegisterInvoice = makeRegisterInvoice();
		const invoice = await serviceRegisterInvoice.execute(body, userId);
        

		return reply.status(201).send(JSON.stringify(invoice));
        
	}catch(err: any){

		const {statusCode, error} = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify({error}));
	}
}