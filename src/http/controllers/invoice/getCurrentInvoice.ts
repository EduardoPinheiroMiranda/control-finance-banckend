import { FastifyRequest, FastifyReply} from "fastify";
import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makeGetCurrentInvoice } from "@/factories/invoice/make-getCurrentInvoice";


export async function getCurrentInvoice(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
        
		
		const serviceGetCurrentInvoice = makeGetCurrentInvoice();
		const invoices = await serviceGetCurrentInvoice.execute(userId);

		return reply.status(200).send(JSON.stringify(invoices));

	}catch(err: any){

		const { statusCode, error } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}