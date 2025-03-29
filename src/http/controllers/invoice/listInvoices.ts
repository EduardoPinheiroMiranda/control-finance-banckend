import { FastifyRequest, FastifyReply} from "fastify";
import { handleErrorsInControlles } from "../../../utils/handleErrorsInControllers";
import { z } from "zod";
import { typeInvoices } from "@/utils/globalValues";
import { makeListInvoices } from "@/factories/invoice/make-listInvoices";


export async function listInvoices(request: FastifyRequest, reply: FastifyReply){

	try{

		const userId = z.string().parse(request.headers["user-id"]);
		const schema = z.object({
			typeInvoice: z.enum(["all", ...typeInvoices])
		});
		const { typeInvoice } = schema.parse(request.params);
        
		
		const serviceListInvoices = makeListInvoices();
		const invoices = await serviceListInvoices.execute(userId, typeInvoice);


		return reply.status(200).send(JSON.stringify(invoices));

	}catch(err: any){

		const { statusCode, error } = handleErrorsInControlles(err);
		return reply.status(statusCode).send(JSON.stringify(error));
	}
}