import { FastifyRequest, FastifyReply} from "fastify";
import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makePayInvoice } from "@/factories/invoice/make-payInvoice";


export async function PayInvoice(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
		const body = z.object({
			invoiceId: z.string(),
			installmentsToPay: z.array(z.string())
		}).parse(request.body);
        
		
		const servicePayInvoice = makePayInvoice();
		const invoice = await servicePayInvoice.execute(
			userId,
			body.invoiceId,
			body.installmentsToPay
		);

		
		return reply.status(200).send(JSON.stringify(invoice));

	}catch(err: any){

		const { statusCode, error } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}