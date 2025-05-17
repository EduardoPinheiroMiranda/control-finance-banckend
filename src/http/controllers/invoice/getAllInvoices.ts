import { FastifyRequest, FastifyReply} from "fastify";
import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { makeGetAllInvoices } from "@/factories/invoice/make-getAllInvoices";


export async function getAllInvoices(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
        
		
		const serviceGetAllInvoices = makeGetAllInvoices();
		const invoices = await serviceGetAllInvoices.execute(userId);

		
		return reply.status(200).send(JSON.stringify(invoices));

	}catch(err: any){

		const { statusCode, error } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}