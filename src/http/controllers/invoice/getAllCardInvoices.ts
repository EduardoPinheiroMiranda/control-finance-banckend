import { FastifyRequest, FastifyReply} from "fastify";
import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makeGetAllCardInvoices } from "@/factories/invoice/make-getAllCardInvoices";


export async function getAllCardInvoices(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
		const params = z.object({
			cardId: z.string()
		}).parse(request.params);
        
		
		const serviceGetAllCardInvoices = makeGetAllCardInvoices();
		const invoices = await serviceGetAllCardInvoices.execute(userId, params.cardId);

		
		return reply.status(200).send(JSON.stringify(invoices));

	}catch(err: any){

		const { statusCode, error } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}