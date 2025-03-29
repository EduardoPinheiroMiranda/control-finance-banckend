import { DataValidationError } from "@/errors/custonErros";
import { makeRegisterInvoice } from "@/factories/invoice/make-registerInvoice";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function registerInvoice(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
        
		const scheme = z.object({
			name: z.string(),
			typeInvoice: z.enum(["fixedExpense", "extraExpenses"]),
			paymentMethod: z.enum(["invoice", "card", "monney"]),
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

		if(err.name === "ZodError"){
			return reply.status(400).send(JSON.stringify({
				msg: "dados enviados incorreto, verifique a estrutura do objeto ou seus valores",
				err: err.errors
			}));
		}

		if(err instanceof DataValidationError){
			return reply.status(400).send(JSON.stringify({
				msg: err.message,
			}));
		}

		console.log(err);
		return reply.status(500).send(JSON.stringify({
			msg: "Error internal server",
		}));
	}
}