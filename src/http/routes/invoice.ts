import { checkToken } from "@/middlewares/checkToken";
import { FastifyInstance } from "fastify";
import { registerInvoice } from "../controllers/invoice/registerInvoice";


export async function invoiceRoutes(app: FastifyInstance){

	app.route({
		method: "POST",
		url: "/registerInvoice",
		preHandler: checkToken,
		handler: registerInvoice
	});
}